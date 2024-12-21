import 'dotenv/config';
import { connectDB } from "./Db/db.js";
import app from './app.js';


// Connect MongoDB

connectDB()
.then(
   ()=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log("running")
    })
   }
)
.catch((err)=>{console.log("Mongodb not connected",err)})
