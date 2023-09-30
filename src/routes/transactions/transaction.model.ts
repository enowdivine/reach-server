import mongoose from "mongoose";

const transaction = new mongoose.Schema(
  {
    courseId: {
      type: String,
      required: [true, "courseId is reuired"],
    },
    userId: {
      type: String,
      required: [true, "userId is reuired"],
    },
    amount: {
      type: Number,
      required: [true, "amount is reuired"],
    },
    paymentMethod: {
      type: String,
      required: [true, "payment method is reuired"],
    },
    status: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Transaction", transaction);
