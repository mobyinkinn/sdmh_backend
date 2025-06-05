import mongoose, { Schema } from "mongoose";

const bannerSchema = new Schema(
  {
    images: {
      type: [String],
      required: true,
      trim: true,
    },

    mobileimages: {
      type: [String],
      required: true,
      trim: true,
    },

     banner: {
      type: String,
      required: false,
      trim: true,
    },

    mobileBanner: {
      type: String,
      required: false,
      trim: true,
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
