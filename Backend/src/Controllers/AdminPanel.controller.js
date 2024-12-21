import { bookings } from "../Models/Bookings.model.js";
import { Tourpackage } from "../Models/Tourpackage.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { removefromcloud, uploadfileoncloud } from "../utils/FileUpload.js";
import mongoose from "mongoose";

const addpackage=asynchandler(async(req,res)=>{
    // post request to add an new tour package for the given admin
    const admin=req.user;
    if(!admin.isadmin){
        return res.status(400).json( new ApiError(403,"Forbidden Request")
    )}
    
    const {Title,Description,Price,start,end,Availability}=req.body;

    const Imagepath=req.file?.path
    // console.log(Imagepath)
    if (!Imagepath){
        return res.status(400).json( new ApiError(400,"Invalid Path of image")        
    )}
    const Image=await uploadfileoncloud(Imagepath)

    // console.log(Image)
    if(!Image?.url){
        return res.status(400).json( new ApiError(500,"Error while uploading to cloud")
    )}


    const existingtour=await Tourpackage.findOne({Title:Title})
    
    if(existingtour){
        return res.status(400).json( new ApiError(401,"Tour Package already exists")
    )}
    const tourpackage= await Tourpackage.create({Title,Description,Price,Image:Image.public_id,Available_dates:{
        start:start,end:end},Admin:admin,isPublic:true,Availability:Availability})
    
    if(!tourpackage){
        return res.status(400).json( new ApiError(500,"Error while creating the package")
    )}
    return res.status(201).json(
        new ApiResponse(201,tourpackage,"Tour package added Successfully")
    )


})

const deletepackage=asynchandler(async(req,res)=>{
    //delete request to delete to an existing package
    const {id}=req.params

    const tpackage=await Tourpackage.findById(id)
    if(!tpackage){
        return res.status(400).json( new ApiError(404,"Package doesn't exist")
    )}
    try {
        await Tourpackage.findByIdAndDelete(tpackage._id)
        
    } catch (err) {
        return res.status(400).json( new ApiError(500,"Error while deleting the package")
    )}
    return res.status(203).json(
        new ApiResponse(203,{},"Package deleted Successfully!!!!!")
    )



})

const togglepackagepublishstatus = asynchandler(async (req,res) => {
    const { id } = req.params;
  
    // Perform the toggle in a single query
    const updatedPackage = await Tourpackage.findByIdAndUpdate(
      id,
      [{ $set: { isPublic: { $not: "$isPublic" } } }], 
      { new: true }
    );
  
    if (!updatedPackage) {
      return res.status(400).json( new ApiError(404, "Package doesn't exist")
  )  }
  
    return res.status(200).json(
      new ApiResponse(200, updatedPackage, "Status flipped successfully")
    );
  });
  

const updatepackage=asynchandler(async(req,res)=>{
    // put request to update the existing package
    const {id}=req.params;
    const tourpackage=await Tourpackage.findById(id);
    if(!tourpackage){
        return res.status(400).json( new ApiError(404,"Package doesn't exist")
    )}
    const {Title,Description,Price,start,end,Availability}=req.body;
    const Imagepath=req.file?.path
    let Image;
    // console.log(Imagepath)
    if (Imagepath){
        await removefromcloud(tourpackage.Image,"image")
        Image=await uploadfileoncloud(Imagepath)  
    }
    
    let updatepack;
  try {
       updatepack=await Tourpackage.findByIdAndUpdate(tourpackage._id,{
          $set:{
            Title:Title,
          Description:Description,
          Price:Price,
          Availability:Availability,
          Available_dates:{
              start:start,
              end:end,
          },
          Image:Image || tourpackage.Image,
          isPublic:tourpackage.isPublic,
          Admin:tourpackage.Admin
  }
      },{
          new:true,runValidators:true
      });
  } catch (error) {
    return res.status(400).json( new ApiError(500,error.message || "Error while updating")
)  }
    if(!updatepack){
        return res.status(400).json(  new ApiError(500,"Error while updating the package")
    )}
    return res.status(201).json(
        new ApiResponse(201,updatepack,"Package updated Successfully")
    );
});

const getallpackages=asynchandler(async(req,res)=>{
   
    let packages;
    try {
        packages=await Tourpackage.find({});
    } catch (error) {
        return res.status(400).json( new ApiError(500,"Error while retriving tourpackages")
    )}
    if (!packages){
        return res.status(400).json( new ApiError(203,"No packages")
    )}
    return res.status(200).json(
        new ApiResponse(200,packages,"Packages retrived successfully")
    )

})
const getallpackagesofadminowned=asynchandler(async(req,res)=>{
    const admin=req.user;
   
    let packages;
    try {
        packages=await Tourpackage.find({Admin:admin});
    } catch (error) {
        return res.status(400).json( new ApiError(500,"Error while retriving tourpackages")
    )}
    if (!packages){
        return res.status(400).json( new ApiError(203,"No packages")
    )}
    return res.status(200).json(
        new ApiResponse(200,packages,"Packages retrived successfully")
    )

})
const getbookings = asynchandler(async (req, res) => {
    const { id } = req.params;
    const admin = req.user;

    const tourpackage = await Tourpackage.findById(id);
    if (!tourpackage) {
        return res.status(400).json( new ApiError(404, "Package doesn't exist")
    )}

    const tBookings = await bookings.aggregate([
        {
            $match: {
                Tourpackage: new mongoose.Types.ObjectId(id),
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "BookedBy",
                foreignField: "_id",
                as: "BookedBy",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            Fullname: 1,
                            email: 1,
                            username: 1,
                            CoverImage: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$BookedBy",
        },
        {
            $match: {
                "BookedBy._id": new mongoose.Types.ObjectId(admin._id),
            },
        },
        {
            $lookup: {
                from: "tourpackages",
                localField: "Tourpackage",
                foreignField: "_id",
                as: "Tourpackage",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            Title: 1,
                            Description: 1,
                            Price: 1,
                            Availability: 1,
                        },
                    },
                ],
            },
        },
        {
            $unwind: "$Tourpackage",
        },
        {
            $project: {
                _id: 1,
                BookedBy: 1,
                Tourpackage: 1,
                NumberofTravellers: 1,
                specialrequest: 1,
                Customerdetails: 1,
            },
        },
    ]);

    if (tBookings.length === 0) {
        return res.status(400).json( new ApiError(204, "No Bookings found for this tour package.")
    )}

    return res.status(200).json({
        status: 200,
        data: tBookings,
        message: "Bookings fetched successfully",
    });
});

export {getallpackages,addpackage,deletepackage,togglepackagepublishstatus,updatepackage,getbookings,getallpackagesofadminowned}






