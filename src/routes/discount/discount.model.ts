import mongoose from "mongoose";

const discount = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "amount is required"],
    },
    token: {
      type: String,
      required: [true, "token is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Discount", discount);
