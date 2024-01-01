import mongoose from "mongoose";

export const connectDB = async () => await mongoose.connect(process.env.MONGODB_CONNECTION_URI as string);


