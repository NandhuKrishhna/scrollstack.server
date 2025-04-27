import mongoose from "mongoose";
import { MONGODB_URL } from "../constants/env";
let isConnected = false;

export async function connectDB() {
    if (isConnected) return;

    try {
        await mongoose.connect(MONGODB_URL);
        isConnected = true;
        console.log("✅ MongoDB connected with Mongoose");
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error);
        throw error;
    }
}
