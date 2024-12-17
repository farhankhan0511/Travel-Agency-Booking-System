import { asynchandler } from "../utils/asynchandler.js";
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../Models/User.model.js";


export const verifyJWT=asynchandler(async(req,res,next)=>{
    try{
        console.log(req.cookies)
        const token=req.cookies?.accesstoken || req.header("Authorization").split(" ")[1];

        console.log(token)
        
        if (!token){
            throw new ApiError(401,"Unauthorized Request")
        }
        const decoded=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decoded?._id).select("-password -refreshtoken")
        if(!user){
            throw new ApiError(400,"Invalid Access Token")
        }
        req.user=user
        next()
    }
    catch(err){
        throw new ApiError(401,err.message || "invalid access token")
    }
})