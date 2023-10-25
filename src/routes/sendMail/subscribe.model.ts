import mongoose from "mongoose";

const emailModel = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("EmailModel", emailModel);
