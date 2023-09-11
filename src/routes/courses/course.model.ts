import mongoose from "mongoose";

const course = new mongoose.Schema(
  {
    instructorId: {
      type: String,
      required: [true, "instructorId is required"],
    },
    title: {
      type: String,
      required: [true, "title is required"],
    },
    introVideoUrl: {
      type: String,
      default: "",
    },
    desc: {
      type: Object,
      required: [true, "description is required"],
    },
    category: {
      type: Array,
      required: [true, "category is required"],
    },
    coverImage: {
      type: Object,
      required: [true, "cover image is required"],
    },
    price: {
      type: Number || String,
      default: 0,
    },
    courseLevel: {
      type: String,
      default: "",
    },
    saleCount: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
    tags: {
      type: Array,
      default: [],
    },
    language: {
      type: String,
      default: "",
    },
    rating: {
      type: String,
      default: "",
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Course", course);
