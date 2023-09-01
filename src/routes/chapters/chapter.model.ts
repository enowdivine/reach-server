import mongoose from "mongoose";

const chapter = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, "courseId is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chapter", chapter);
