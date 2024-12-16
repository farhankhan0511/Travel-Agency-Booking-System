import { ApiError } from "../utils/ApiError.js";
import { asynchandler } from "../utils/asynchandler.js";

export const isadmin=asynchandler(async(req,res,next)=>{
    const user=req.user
    if (!user.isadmin){
        throw new ApiError(400,"Not authorized to access the admin page")
    }
    next();
})