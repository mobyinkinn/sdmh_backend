import mongoose, { Schema } from "mongoose";

const eventsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    SmallDescription: {
      type: String,
      required: true,
      trim: true,
    },
    Description: {
      type: String,
      required: true,
      trim: true,
    },
    Date: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default:false
    },
  },
  { timestamps: true }
);

export const Events = mongoose.model("Events", eventsSchema);
