import mongoose from "mongoose";

const workExperience = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "user ID is require"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    company: {
      type: String,
      required: [true, "company is required"],
    },
    description: {
      type: String,
      required: [true, "description is required"],
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    isPresent: {
      type: Boolean,
      default: false,
    },
    companyWebsite: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("WorkExperience", workExperience);
