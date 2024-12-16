import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiError } from "./ApiError.js";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
  });


export const uploadfileoncloud=async(localpath)=>{
    if(!localpath) return null
    try {
        
        
        const response = await cloudinary.uploader.upload(localpath);

        fs.unlinkSync(localpath);
        return response;
    } catch (err) {
        // fs.unlinkSync(newpath);
        console.log(err.message)
        fs.unlinkSync(localpath);
        throw new ApiError(500,err.message)
    }



}

export const removefromcloud=async(public_id,resource_type)=>{
    try {
        await cloudinary.uploader.destroy(public_id,{resource_type:resource_type})
    } catch (err) {
        throw new ApiError(500,"Error while removing file from cloud")
    }
}