import { bookings } from "../Models/Bookings.model.js";
import { Tourpackage } from "../Models/Tourpackage.model.js";
import { User } from "../Models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import {z} from "zod"

const CustomerdetailsSchema=z.object({
    name:z.string().min(3,"Name is required"),
    age:z.number().int().positive(),
    gender:z.string(),
    phone:z.string().min(10).max(10)
})


const booktour=asynchandler(async(req,res)=>{
    try {
        console.log("Incoming Request:", req.body);
        const {id}=req.params;
        
        const user=req.user;
        const tour= await Tourpackage.findById(id);
        if(!tour || !tour.isPublic){
            return res.status(400).json( new ApiError(404,"Tour Package doesn't exists")
        )}
        const existingbooking=await bookings.findOne({BookedBy:user,Tourpackage:tour})
        if(existingbooking){
            console.log("here")
            return res.status(400).json(new ApiError(400,"Booking already exists"))
            // return res.status(400).json( new ApiError(400,"Booking already exists")
           
        }
        
        const {NumberofTravellers,Customerdetails,specialrequest}=req.body;
        if(!(NumberofTravellers && Customerdetails)){
            return res.status(400).json( new ApiError(400,"Fill all the details")
        )}
        for (const [index, customer] of Customerdetails.entries()) {
            const result = CustomerdetailsSchema.safeParse(customer);
            if (!result.success) {
              const errorMessage = result.error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("; ");
              return res.status(400).json( new ApiError(400, `Error in customer ${index + 1}: ${errorMessage}`)
          )  }
          }
        
    
        
        
    
        if(tour.Availability<NumberofTravellers){
            return res.status(400).json( new ApiError(204,"No Seats Available to Book")
        )}
    
        
    
       const Booking= await bookings.create({
            BookedBy:user,
            Tourpackage:tour,
            NumberofTravellers:NumberofTravellers,
            Customerdetails:Customerdetails,
            specialrequest:specialrequest
        })
        if(!Booking){
            return res.status(400).json( new ApiError(500,"Error while Booking the package")
        )}
        await Tourpackage.findByIdAndUpdate(
            tour._id,
            { $inc: { Availability: -NumberofTravellers } }
        );
        await User.findByIdAndUpdate(
            user._id,
            { $push: { Bookings: Booking } }
        );
        res.status(201).json(
            new ApiResponse(201,Booking,"Tour Booked Successfully")
        )
    
    }catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }


})

const CancelTour=asynchandler(async(req,res)=>{
    const {id}=req.params;

    const existbooking=await bookings.findById(id);
    if(!existbooking){
        return res.status(400).json( new ApiError(404,"Booking Doesn't exist")
    )}
    console.log(existbooking)
    const tourid=existbooking?.Tourpackage?._id;
    let increment=0;
    increment=existbooking.NumberofTravellers
try {
    
    await Tourpackage.findByIdAndUpdate(
        tourid,
        { $inc: { Availability:increment } }
    );
    await bookings.findByIdAndDelete(id)
} catch (error) {
    return res.status(400).json( new ApiError(500,error.message || "Something went wrong while cancelling the tour")
)}
res.status(200).json(
    new ApiResponse(200,{},"Booking cancelled Successfully")
)




})

const getbookingdetails=asynchandler(async(req,res)=>{
    const user=req.user;
    const {id}=req.params;
    console.log(id)
    const existbooking=await bookings.findById(id);
    if(!existbooking){
        return res.status(400).json( new ApiError(404,"Booking Doesn't exist")
    )}
    console.log(existbooking)
    const details=await bookings.find({_id:id,BookedBy:user});
    if(!details){
        return res.status(400).json( new ApiError(401,"Unauthorized Request")
    )}
    res.status(200).json(
        new ApiResponse(200,details,"Details fetched Successfully")
    )
})


export {booktour,CancelTour,getbookingdetails}