import { bookings } from "../Models/Bookings.model";
import { Tourpackage } from "../Models/Tourpackage.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asynchandler } from "../utils/asynchandler";
import {z} from "zod"

const CustomerdetailsSchema=z.object({
    name:z.string().min(3,"Name is required"),
    age:z.number().int().positive(),
    gender:z.string(),
    phone:z.string().min(10).max(10)
})


const booktour=asynchandler(async(req,res)=>{
    const tourid=req.params;

    const {NumberofTravellers,Customerdetails,specialrequest}=req.body;
    if(!(NumberofTravellers && Customerdetails)){
        throw new ApiError(400,"Fill all the details");
    }
    Customerdetails.map((customer)=>{
        try {            
            CustomerdetailsSchema.parse(customer)
        } catch (err) {
            throw new ApiError(400,"Fill Customer Details Properly")
        }
    })

    const tour= await Tourpackage.findById(tourid);
    if(!tour || !tour.isPublic){
        throw new ApiError(404,"Tour Package doesn't exists")
    }
    const user=req.user;

    if(tour.Availability<NumberofTravellers){
        throw new ApiError(204,"No Seats Available to Book")
    }

   const Booking= await bookings.create({
        BookedBy:user,
        Tourpackage:tour,
        NumberofTravellers:NumberofTravellers,
        Customerdetails:Customerdetails,
        specialrequest:specialrequest
    })
    if(!Booking){
        throw new ApiError(500,"Error while Booking the package")
    }
    tour.Availability-=NumberofTravellers;
    tour.save({validateBeforeSave:false})
    res.status(201).json(
        new ApiResponse(201,Booking,"Tour Booked Successfully")
    )



})

const CancelTour=asynchandler(async(req,res)=>{
    const existbookingid=req.params;

    const existbooking=await bookings.findById(existbookingid);
    if(!existbooking){
        throw new ApiError(404,"Booking Doesn't exist")
    }

    const tourid=existbooking.Tourpackage._id;
try {
    
    await bookings.findByIdAndDelete(existbookingid)
        await Tourpackage.findByIdAndUpdate(tourid,{
            $set:{
                Availability:Availability-existbooking.NumberofTravellers
            }
        })
} catch (error) {
    throw new ApiError(500,error.message || "Something went wrong while cancelling the tour")
}
res.status(200).json(
    new ApiResponse(200,{},"Booking cancelled Successfully")
)




})

const getbookingdetails=asynchandler(async(req,res)=>{
    const user=req.user;
    const existbookingid=req.params;
    const existbooking=await bookings.findById(existbookingid);
    if(!existbooking){
        throw new ApiError(404,"Booking Doesn't exist")
    }

    const details=await bookings.findOne({_id:existbookingid,BookedBy:user});
    if(!details){
        throw new ApiError(401,"Unauthorized Request")
    }
    res.status(200).json(
        new ApiResponse(200,details,"Details fetched Successfully")
    )
})
