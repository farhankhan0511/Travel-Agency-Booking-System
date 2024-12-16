import { ApiError } from "../utils/ApiError";
import { asynchandler } from "../utils/asynchandler";

export const isadmin=asynchandler(async(req,next)=>{
    const user=req.user
    if (!user.isadmin){
        throw new ApiError(400,"Not authorized to access the admin page")
    }
    next();
})