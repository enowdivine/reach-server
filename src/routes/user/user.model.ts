import mongoose from "mongoose";

const user = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "user email is required"],
      unique: true,
    },
    emailConfirmed: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: [true, "user pasword is required"],
    },
    bio: {
      type: String,
      default: "",
    },
    avatar: {
      type: Object,
      default: null,
    },
    country: {
      type: String,
      default: "",
    },
    purchasedCourses: {
      type: Array,
      default: [],
    },
    wishlist: {
      type: Array,
      default: [],
    },
    cart: {
      type: Array,
      default: [],
    },
    status: {
      type: String,
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", user);
