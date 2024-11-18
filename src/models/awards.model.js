import mongoose, { Schema } from "mongoose";

const awardsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    about: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Awards = mongoose.model("Award", awardsSchema);
