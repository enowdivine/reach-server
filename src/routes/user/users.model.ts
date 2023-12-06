import mongoose from "mongoose";

const users = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "freelancer",
    },
    profileImage: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
    phone: {
      type: Number,
      required: [true, "phone number is required"],
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    description: {
      type: String,
    },
    headline: {
      type: String,
    },
    yearsofExperience: {
      type: Number,
    },
    website: {
      type: String,
    },
    skills: {
      type: Array,
      default: [],
    },
    availability: {
      type: String,
      default: "available",
    },
    relocationStatus: {
      type: String,
      default: "willing",
    },
    location: {
      type: String,
    },
    geoLocation: {
      longitude: String,
      latitude: String,
    },
    appliedJobs: {
      type: Array,
      default: [],
    },
    savedJobs: {
      type: Array,
      default: [],
    },
    gallery: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Users", users);
