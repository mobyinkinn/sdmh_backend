import mongoose, { Schema } from "mongoose";

const blogsSchema = new Schema(
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
    date: {
      type: String,
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

export const Blogs = mongoose.model("Blogs", blogsSchema);
