import mongoose, { Schema } from "mongoose";

const available_datesSchema=new mongoose.Schema({
    start:{
        type:Date,
        required:true
    },
    end:{
        type:Date,
        required:true
    }
})

const TourpackageSchema=new mongoose.Schema({
    Admin:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    Title:{
        type:String,
        required:true,
        unique:true,
        trim:true,

    },
    Description:{
        type:String,
        trim:true,
    },
    Price:{
        type:Number
    },
    Available_dates:{
        type:available_datesSchema
    },
    Image:{
        type:String,
        required:true
    },
    isPublic:{
        type:Boolean,
        default:true,
        required:true
    }

},{timestamps:true})

export const Tourpackage=mongoose.model("Tourpackages",TourpackageSchema)