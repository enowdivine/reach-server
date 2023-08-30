import mongoose from "mongoose";

const admin = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "admin email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "admin pasword is required"],
    },
    role: {
      type: String,
      required: [true, "admin role is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", admin);
