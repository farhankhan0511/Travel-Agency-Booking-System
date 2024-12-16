import { Router } from "express";
import { editpfp, getcurrentUser, logout, refreshAccesstoken, registerUser, Updatepassword, userlogin } from "../Controllers/User.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router=Router()

router.route("/signup").post(registerUser)
router.route("/signin").post(userlogin)
router.route("/logout").get(verifyJWT,logout)
router.route("/currentuser").get(verifyJWT,getcurrentUser)
router.route('/updatepassword').patch(verifyJWT,Updatepassword)
router.route("/refresh").get(verifyJWT,refreshAccesstoken)

router.route('/CoverImage').patch(verifyJWT,upload.single("CoverImage"),editpfp)



export default router;