
import {asynchandler} from "../utils/asynchandler.js"

import { z } from "zod"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { User } from "../Models/User.model.js"
import { removefromcloud, uploadfileoncloud } from "../utils/FileUpload.js"

const UserSChema=z.object({
    username:z.string(),
    Name:z.string(),
    isadmin:z.boolean(),
    email:z.string().email(),
    password:z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/, 
        "Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, and one digit",
   )
})

const registerUser=asynchandler(async(req,res)=>{
        let validdata;
        try {
            
            validdata=UserSChema.parse(req.body)
            
        } catch (err) {
            throw new ApiError(400,err.message || "Fill the form correctly")
        }
        
            const existeduser=await User.findOne({
                $or:[{username:validdata.username},{email:validdata.email}]
            })
            if(existeduser){ 
                throw new ApiError(400,"User with email or username already exists")
            }
            const user=await User.create({
                username:validdata.username.toLowerCase(),email:validdata.email,password:validdata.password,Name:validdata.Name,isadmin:validdata.isadmin
            })
          
            const createduser=await User.findById(user._id).select("-password -refreshtoken")
         
            if(!createduser){
                throw new ApiError(500,"Something went wrong while signing up the user")
                
            }
            return res.status(201).json(
                new ApiResponse(201,createduser,"User Registered Successfully")
            )
            
   
})

const generateaccesandrefreshtoken=async(user_id)=>{
    try {
        
            const user=await User.findById(user_id)
         
            const accesstoken=await user.generateaccesstoken()
            
            const refreshtoken=await user.generaterefreshtoken()
            user.refreshtoken=refreshtoken
            await user.save({validateBeforeSave:false})
    
            return {accesstoken,refreshtoken}
    } catch (error) {
        throw new ApiError(500,"Error while generating tokens")
    }
   
}

const userlogin=asynchandler(async(req,res)=>{
    const {username,email,password}=req.body
   
   

    if(!(username || email)){
        throw new ApiError(401,"Invalid username and email")
    }
    const user=await User.findOne({$or:[{username},{email}]})
    if (!user){
        throw new ApiError(400,"User Not Found")
    }
    const validpassword= await user.isPasswordCorrect(password)
   
    if(!validpassword){
        throw new ApiError(401,"Invalid Password")

    }
    const {accesstoken,refreshtoken}=await generateaccesandrefreshtoken(user._id)
    const loggedinuser=await User.findById(user._id).select("-password -refreshtoken")

    const options={
        httpOnly:true,
        secure:true,
        sameSite:"None",
        path:"/"
    }

    
    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshtoken",refreshtoken,options)
    .json(
        new ApiResponse(200,
            {
                user:loggedinuser,accesstoken,refreshtoken
            },
            "USer logged In Successfully"
        )
    )



});
const logout=asynchandler(async(req,res)=>{
    try {
        await User.findByIdAndUpdate(req.user?._id,{
            $unset:{refreshtoken:1}
        },{
            new:1
        })
        const options={
            httpOnly:true,
            secure:true,
            sameSite:"None"
        }
        return res.status(200).clearCookie("accesstoken",options).clearCookie("refreshtoken",options).json(
            new ApiResponse(200,{},"User Logout Successfull")
        )
    } catch (err) {
        throw new ApiError(500,"Something went wrong while logouting")
    }
})

const refreshAccesstoken=asynchandler(async(req,res)=>{
    const incomrefreshtoken=req.cookies.refreshtoken || req.body.refreshtoken
    if(!incomrefreshtoken){
        throw new ApiError(400,"Unauthorized request")
    }
    try{
        const decode=await jwt.verify(incomrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decode?._id)
        if(!user){
            throw new ApiError(401,"Unauthorized request")
        }
        if (incomrefreshtoken!==user?.refreshtoken){
            throw new ApiError(400,"Refresh Token expired")

        }
        options={
            httpOnly:true,secure:true
        }
        const {accesstoken,newrefreshtoken}=generateaccesandrefreshtoken(user._id)
        return res.status(200).cookie("accesstoken",accesstoken,options).cookie("newrefreshtoken",newrefreshtoken,options).json(
            new ApiResponse(200,{accesstoken,refreshtoken:newrefreshtoken},"Tokens refreshed successfully")
        )
    }
    catch(err){
        throw new ApiError(500,"SOmething wrong while refershing tokens")
    }


})
const getcurrentUser=asynchandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200,req.user,"Current user fetched Successfully")
    )
})

const Updatepassword=asynchandler(async(req,res)=>{
    const {oldpassword,newpassword}=req?.body
    if(!((validator.isStrongPassword(oldpassword,{minSymbols:1,minLength:8,minNumbers:1})-1) || (validator.isStrongPassword(newpassword,{minSymbols:1,minLength:8,minNumbers:1})-1))){
        throw new ApiError("Password should contain 8 length with atleast 1 symbol and 1 number")
    }
    const user=await User.findById(req.user?._id)
    const validpass=user.isPasswordCorrect(oldpassword)
    if(!validpass){
        throw new ApiError(400,"Incorrect Password")
    }
    user.password=newpassword
    await user.save({validateBeforeSave:false})

    return res.status(200).json(200,{},"password changed successfully")
})

const editpfp=asynchandler(async(req,res)=>{
    console.log(req.file)
    const CoverImagepath=req.file?.path
    console.log(CoverImagepath)
    if (!CoverImagepath){
        throw new ApiError(400,"Invalid Path of image")
        
    }
    const CoverImage=await uploadfileoncloud(CoverImagepath)

    console.log(CoverImage)
    if(!CoverImage.url){
        throw new ApiError(500,"Error while uploading to cloud")
    }
    if (req.user?.CoverImage){
        await removefromcloud(req.user.CoverImage)
    }
    const user=await User.findByIdAndUpdate(req.user?._id,{
        $set:{
            CoverImage:CoverImage.url
        }
    },{
        new:true
    }).select("-password -refreshtoken")

    return res.status(200).json(
        new ApiResponse(200,user,"Coverimage uploaded successfully")
    )


})

const deleteAccount=asynchandler(async(req,res)=>{
    const userid=req.user?._id
    if(!userid){
        throw new ApiError(400,"Unauthorized request")
    }
    try {
        await User.findByIdAndDelete(userid)
        res.status(205).json(
            new ApiResponse(205,{},"Account Deleted Successfully")
        )
    } catch (error) {
        throw new ApiError(500,"Error deleting the account")
    }

});


export {registerUser,deleteAccount,logout,userlogin,editpfp,Updatepassword,getcurrentUser,refreshAccesstoken}