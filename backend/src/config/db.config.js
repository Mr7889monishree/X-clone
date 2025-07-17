import mongoose from "mongoose"
import { ENV } from "./env.config.js"



export const DB=async()=>{
    try {
        const conn = await mongoose.connect(ENV.MONGO_URI);
        console.log("The database is connected successfully✅");
        
    } catch (error) {
        console.error(error.message);
        process.exit(1);
        
    }
}

