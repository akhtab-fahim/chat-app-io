import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


export const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL);
        console.log("DataBase Connected :: ",connectionInstance.connection.host);
        
    } catch (error) {
        console.log("Error connectiong database :: ",error);
    }
}
