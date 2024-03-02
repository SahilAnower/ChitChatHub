import mongoose from "mongoose";

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.info("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error?.message);
  }
};

export default connectToMongoDB;
