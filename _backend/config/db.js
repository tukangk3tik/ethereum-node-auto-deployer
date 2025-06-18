import mongoose from "mongoose";

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit process on failure
  }
}

export default connectDB;