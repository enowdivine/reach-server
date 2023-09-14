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
    content: {
      type: Object,
      required: [true, "content is required"],
    },
    duration: {
      type: Number,
      required: [true, "duration is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Lesson", lesson);
