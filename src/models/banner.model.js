import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    banner: {
      type: String,
      required: true,
    },
    page: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Banner = mongoose.model("Banner", bannerSchema);
