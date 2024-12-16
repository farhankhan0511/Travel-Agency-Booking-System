import { bookings } from "../Models/Bookings.model";
import { Tourpackage } from "../Models/Tourpackage.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asynchandler } from "../utils/asynchandler";

const addpackage=asynchandler(async(req,res)=>{
    // post request to add an new tour package for the given admin
    const {Title,Description,Price,start,end,Availability}=req.body;

    const Imagepath=req.file?.path
    console.log(Imagepath)
    if (!Imagepath){
        throw new ApiError(400,"Invalid Path of image")        
    }
    const Image=await uploadfileoncloud(Imagepath)

    console.log(Image)
    if(!Image.url){
        throw new ApiError(500,"Error while uploading to cloud")
    }


    const existingtour=await Tourpackage.findOne({Title:Title})
    
    if(existingtour){
        throw new ApiError(401,"Tour Package already exists");
    }
    const tourpackage= await Tourpackage.create({Title,Description,Price,Image,Available_dates:{
        start:start,end:end},Admin:req.user,isPublic:true,Availability:Availability})
    
    if(!tourpackage){
        throw new ApiError(500,"Error while creating the package")
    }
    res.status(201).json(
        new ApiResponse(201,tourpackage,"Tour package added Successfully")
    )


})

const deletepackage=asynchandler(async(req,res)=>{
    //delete request to delete to an existing package
    const id=req.params

    const tpackage=await Tourpackage.findById(id)
    if(!tpackage){
        throw new ApiError(404,"Package doesn't exist")
    }
    try {
        await Tourpackage.findByIdAndDelete(tpackage._id)
        
    } catch (err) {
        throw new ApiError(500,"Error while deleting the package")
    }
    res.status(203).json(
        new ApiResponse(203,{},"Package deleted Successfully!!!!!")
    )



})

const togglepackagepublishstatus=asynchandler(async(req,res)=>{
    // post request to toggle package public status
    const id=req.params
    const tourpackage=await Tourpackage.findById(id)
    if(!tourpackage){
        throw new ApiError(404,"Package doesn't exist")
    }
    tourpackage.isPublic=true;
    tourpackage.save({validateBeforeSave:false});
    res.status(200,{},"Status flipped Successfully")
})

const updatepackage=asynchandler(async(req,res)=>{
    // put request to update the existing package
    const id=req.params;
    const tourpackage=await Tourpackage.findById(id);
    if(!tourpackage){
        throw new ApiError(404,"Package doesn't exist");
    }
    const {Title,Description,Price,start,end}=req.body;

    const updatepack=await Tourpackage.findByIdAndUpdate(id,{
        Title:Title,
        Description:Description,
        Price:Price,
        Available_dates:{
            start:start,
            end:end,
        },
        Image:tourpackage.Image,
        isPublic:tourpackage.isPublic,
        Admin:tourpackage.Admin

    });
    if(!updatepack){
        throw  new ApiError(500,"Error while updating the package")
    }
    res.status(201).json(
        new ApiResponse(201,updatepack,"Package updated Successfully")
    );
});

const getbookings=asynchandler(async(req,res)=>{

    const id=req.params
    const tourpackage=await Tourpackage.findById(id);
    if(!tourpackage){
        throw new ApiError(404,"Package doesn't exist");
    }

    const tBookings=await bookings.aggregate([{
        $match:{
            Tourpackage:tourpackage,
            Admin:req.user
        }        
    }
]);    

if(!tBookings ){
    throw new ApiError(204,"NO Bookings")
}
res.status(302,tBookings,"Bookings fetched Successfully")
});




