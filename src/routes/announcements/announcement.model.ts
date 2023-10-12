import mongoose from "mongoose";

const announcement = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, "courseId is required"],
    },
    content: {
      type: Object,
      required: [true, "content is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Announcement", announcement);
