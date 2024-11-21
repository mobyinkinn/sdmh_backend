import mongoose, { Schema } from "mongoose";

const checkupSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      trim: true,
      required: true,
    },
    bannerImage: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { timestamps: true }
);

export const Checkup = new mongoose.model("Checkup", checkupSchema);
