import mongoose from "mongoose";

const instructor = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "instructor email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "instructor pasword is required"],
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "instructor",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Instructor", instructor);
