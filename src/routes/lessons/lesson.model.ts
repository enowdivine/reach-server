import mongoose from "mongoose";

const lesson = new mongoose.Schema(
  {
    chapterId: {
      type: String,
      required: [true, "chapterId is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    duration: {
      type: Date,
      default: null,
    },
    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lesson", lesson);
