import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log("connected to DB successfully.");
  } catch (error) {
    console.log("Error connecting to MONGODB");
    process.exit(1);
  }
};
