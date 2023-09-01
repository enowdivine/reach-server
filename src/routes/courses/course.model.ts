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
      required: [true, "introductory video url is required"],
    },
    desc: {
      type: String,
      required: [true, "description is required"],
    },
    category: {
      type: Array,
      required: [true, "category is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    price: {
      type: Number || String,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    courseLevel: {
      type: String,
      default: "",
    },
    numberOfChapters: {
      type: Number,
      default: 0,
    },
    numberOfLessons: {
      type: Number,
      default: 0,
    },
    saleCount: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Date,
      default: null,
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
