import 'dotenv/config';
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({limit:"16kb",extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || "https://friendly-granita-551626.netlify.app");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.status(200).end();
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err.message,
  });
});

import userRouter from "./Routes/User.Routes.js";
import adminRouter from "./Routes/Admin.Routes.js";
import bookRouter from "./Routes/Book.routes.js";
import { getallpackages } from "./Controllers/AdminPanel.controller.js";


app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/booking", bookRouter);
app.get("/api/v1/all", getallpackages);

export default app;
