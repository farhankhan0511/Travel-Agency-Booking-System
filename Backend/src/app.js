import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app=express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb",extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./Routes/User.Routes.js"
import adminRouter from "./Routes/Admin.Routes.js"
import bookRouter from "./Routes/Book.routes.js"
app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/book",bookRouter);
export default app;