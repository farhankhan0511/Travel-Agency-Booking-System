import { Tourpackage } from "../Models/Tourpackage.model";
import { ApiError } from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

export const isadminauthentic=asynchandler(async(req,res,next)=>{

    const tourid=req.params;
    
    const user=req.user;
    
    try {
        const tour=await Tourpackage.findOne({_id:tourid,Admin:user})
       
    } catch (error) {
        new ApiError(402,error.message || "Unauthorized request")
    } if(!tour){
        new ApiError(402,"Unauthorized request")
    }
    next();

})