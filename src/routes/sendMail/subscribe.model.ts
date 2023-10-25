import mongoose from "mongoose";

const emailModel = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Subscription", emailModel);
