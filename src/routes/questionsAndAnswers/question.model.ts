import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    users: {
      type: Array,
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", questionSchema);
