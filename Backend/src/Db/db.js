import mongoose from "mongoose"
import { db_name } from "../constants.js"

export const connectDB=async()=>{
try {
    const connectionst=await mongoose.connect(`${process.env.MONGODB_URI}/${db_name}`)
    console.log(`${connectionst.connection.host}`)
} catch (error) {
    console.log("Error connecting to mongodb",error)
    process.exit(1);
}
}
