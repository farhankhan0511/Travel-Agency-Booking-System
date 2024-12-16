
import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware";
import { isadmin } from "../Middlewares/isadmin.middlleware";
import { upload } from "../Middlewares/multer.middleware";
import { isadminauthentic } from "../Middlewares/isadminauthentic.middleware";
import { addpackage, deletepackage, getallpackages, getbookings, togglepackagepublishstatus, updatepackage } from "../Controllers/AdminPanel.controller";

const router=Router();

router.route("/add").post(verifyJWT,isadmin,upload.single("TourImage"),addpackage);

router.route("/delete/:id").delete(verifyJWT,isadmin,isadminauthentic,deletepackage);

router.route("/update/:id").put(verifyJWT,isadmin,isadminauthentic,updatepackage);

router.route("/togglestatus/:id").post(verifyJWT,isadmin,isadminauthentic,togglepackagepublishstatus);

router.route("/").get(verifyJWT,isadmin,getallpackages);

router.route("/bookings/:id").get(verifyJWT,isadmin,isadminauthentic,getbookings);

export default router;