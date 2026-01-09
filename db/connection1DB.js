import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const MongoDB_URL = process.env.MongoDB_URL;
        if (!MongoDB_URL || MongoDB_URL === "mongodb_uri_here") {
            console.warn("\x1b[31m%s\x1b[0m", "ERROR: MongoDB_URL is not configured!");
            console.warn("\x1b[33m%s\x1b[0m", "Please update the 'MongoDB_URL' in your 'server/.env' file with your actual MongoDB connection string.");
            return;
        }
        const instance = await mongoose.connect(MongoDB_URL);
        console.log(`MongoDB connected:${instance.connection.host}`)
    }
    catch (error) {
        console.log(error)
    }
}