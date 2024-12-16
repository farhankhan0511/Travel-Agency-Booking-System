import mongoose, { Schema } from "mongoose";



const CustomerDetailSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender:{
        type:String,
        requried:true
    },
    phone: {
        type: String,
        required: true,
    },
});

const bookingSchema=new Schema({
    BookedBy:{
        type:Schema.Types.ObjectId,    
        ref:"User"  

    },
    Tourpackage:{
        type:Schema.Types.ObjectId,
        ref:"Tourpackages"
    },
    // Name:{
    //     type:String,
    //     required:true,
    //     trim:true,
    // },
    // Email:{
    //     type:String,
    //     requried:true,
    // },
    NumberofTravellers:{
        type:Number,
        required:true,
        default:1,
    },
    specialrequest:{
        type:String
    },
    Customerdetails:[{
        type:[CustomerDetailSchema]
    }]
},{timestamps:true})

export const bookings=mongoose.model("bookings",bookingSchema)