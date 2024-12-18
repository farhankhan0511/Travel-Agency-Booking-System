import 'dotenv/config'

import { connectDB } from "../Db/db.jsS";
import app from '../app.js';


connectDB()
.then(
    ()=>{
        app.listen(process.env.PORT || 3000,()=>{
            console.log("Server is running at port ",process.env.PORT)
        })

    }
)
.catch((err)=>{console.log("Mongodb not connected",err)})
