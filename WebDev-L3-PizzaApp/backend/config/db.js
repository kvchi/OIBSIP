import mongoose from "mongoose";

// Connects to MongoDB Atlas using the URI stored in .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process — the app can't function without a DB connection
    process.exit(1);
  }
};

export default connectDB;