import mongoose, { Schema } from "mongoose";

const checkupSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    price: {
      type: Number,
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
    smallDescription: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    shortdescription: {
      type: String,
      trim: true,
      required: true,
    },
    status: {
      type: Boolean,
      trim: true,
      required: true,
    },
    images: {
      type: [String],
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Checkup = new mongoose.model("Checkup", checkupSchema);
