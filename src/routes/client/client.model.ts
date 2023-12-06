import mongoose from "mongoose";

const client = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "client",
    },
    profileImage: {
      type: String,
    },
    username: {
      type: String,
      required: [true, "username is required"],
    },
    phone: {
      type: Number,
      required: [true, "phone number is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    description: {
      type: String,
    },
    headline: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    geoLocation: {
      longitude: String,
      latitude: String,
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

export default mongoose.model("Client", client);
