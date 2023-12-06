import mongoose from "mongoose";

const announcement = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    skills: {
      type: Array,
      required: [true, "skills is required"],
    },
    scope: {
      type: String,
      required: [true, "scope is required"],
    },
    duration: {
      type: String,
      required: [true, "duration is required"],
    },
    experienceLevel: {
      type: String,
      required: [true, "experience level is required"],
    },
    jobType: {
      type: String,
      required: [true, "job type is required"],
    },
    jobLocation: {
      type: String,
      required: [true, "location is required"],
    },
    budget: {
      type: String,
      required: [true, "budget is required"],
    },
    desription: {
      type: String,
      required: [true, "description is required"],
    },
    company: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Announcement", announcement);
