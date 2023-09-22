import mongoose from "mongoose";

const category = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Category", category);
