import { Router } from "express";
import { editpfp, getcurrentUser, logout, registerUser, Updatepassword, userlogin } from "../Controllers/User.controller.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.middleware.js";

const router=Router()

router.route("/register").post(registerUser)
router.route("/login").post(userlogin)
router.route("/logout").get(verifyJWT,logout)
router.route("/currentuser").get(verifyJWT,getcurrentUser)
router.route('/updatepassword').patch(verifyJWT,Updatepassword)


router.route('/CoverImage').patch(verifyJWT,upload.single("CoverImage"),editpfp)



export default router;