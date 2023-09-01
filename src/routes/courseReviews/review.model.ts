import mongoose from "mongoose";

const review = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, "courseId is required"],
    },
    userId: {
      type: String,
      required: [true, "userId is required"],
    },
    rating: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CourseReview", review);
