
import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.middleware";
import { booktour, CancelTour, getbookingdetails } from "../Controllers/Book.controller";

const router=Router();

router.route("/book/:id").post(verifyJWT,booktour);
router.route("/cancel/:id").delete(verifyJWT,CancelTour);
router.route("/details/:id").get(verifyJWT,getbookingdetails)


export default router;


