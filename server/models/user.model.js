import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minLength: 6,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    signupType: {
      type: String,
      default: "App",
      enum: ["App", "Google"],
    },
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
