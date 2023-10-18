import mongoose from "mongoose";

const mail = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
    },
    message: {
      type: String,
      required: [true, "message is required"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("MailTemplate", mail);
