import mongoose, { Schema } from "mongoose";

const eventsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    smallDescription: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Events = mongoose.model("Events", eventsSchema);
