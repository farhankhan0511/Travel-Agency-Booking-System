
import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { isadmin } from "../Middlewares/isadmin.middlleware.js";
import { upload } from "../Middlewares/multer.middleware.js";
import { isadminauthentic } from "../Middlewares/isadminauthentic.middleware.js";
import { addpackage, deletepackage, getallpackages, getallpackagesofadminowned, getbookings, togglepackagepublishstatus, updatepackage } from "../Controllers/AdminPanel.controller.js";

const router=Router();

router.route("/add").post(verifyJWT,isadmin,upload.single("Image"),addpackage);

router.route("/delete/:id").delete(verifyJWT,isadmin,isadminauthentic,deletepackage);

router.route("/update/:id").put(verifyJWT,isadmin,isadminauthentic,upload.single("Image"),updatepackage);

router.route("/togglestatus/:id").post(verifyJWT,isadmin,isadminauthentic,togglepackagepublishstatus);

router.route("/").get(verifyJWT,isadmin,getallpackagesofadminowned);

router.route("/bookings/:id").get(verifyJWT,isadmin,isadminauthentic,getbookings);

export default router;