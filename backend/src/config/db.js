import mongoose from "mongoose";
import { logger } from "../utils/logger.util.js";

export const connectDb = async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}`)
        logger.info("Connected to MongoDB")
    } catch (error) {
        logger.error(`MongoDB connection error: ${error.message}`)
    }
}