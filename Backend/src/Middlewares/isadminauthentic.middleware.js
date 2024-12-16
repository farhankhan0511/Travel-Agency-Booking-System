import { Tourpackage } from "../Models/Tourpackage.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const isadminauthentic=asynchandler(async(req,res,next)=>{

    const {id}=req.params;
    
    const user=req.user;
    let tour;
    try {
        tour=await Tourpackage.findOne({_id:id,Admin:user})
       
    } catch (error) {
        throw new ApiError(402,error.message || "Unauthorized request")
    } if(!tour){
        throw new ApiError(402,"Unauthorized request")
    }
    next();

})