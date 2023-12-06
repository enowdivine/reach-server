import mongoose from "mongoose";

const userEducation = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "user ID is require"],
    },
    school: {
      type: String,
      required: [true, "school is required"],
    },
    graduationYear: {
      type: Date,
      required: [true, "graduationYear is required"],
    },
    degree: {
      type: String,
      required: [true, "degree is required"],
    },
    fieldOfStudy: {
      type: String,
      required: [true, "FieldOfStudy is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("userEducation", userEducation);
