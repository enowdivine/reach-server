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
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
    },
    occupation: {
      type: String,
      required: [true, "occupation is required"],
    },
    educationLevel: {
      type: String,
      required: [true, "level of education is required"],
    },
    targetSubject: {
      type: String,
      required: [true, "subject of specification is required"],
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    resume: {
      type: Object,
      required: [true, "resume is required"],
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
      type: Object,
      default: null,
    },
    country: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      default: "instructor",
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Instructor", instructor);
