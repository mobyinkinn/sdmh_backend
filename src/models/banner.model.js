import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    banner: {
      type: String,
      required: true,
    },
    mobileBanner: {
      type: String,
      required: true,
    },
    link: {
      type: String,
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
