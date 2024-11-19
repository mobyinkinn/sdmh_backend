import mongoose, { Schema } from "mongoose";

const openingSchema = new Schema(
  {
    position: {
      type: String,
      required: true,
      trim: true,
    },

    seats: {
      type: String,
      required: true,
      trim: true,
    },
    lastDate: {
      type: String,
      required: true,
      trim: true,
    },
    programmer: {
      type: String,
      required: true,
      trim: true,
    },
    number: {
      type: String,
      required: true,
      trim: true,
    },
    jd: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Openings = mongoose.model("Opening", openingSchema);
