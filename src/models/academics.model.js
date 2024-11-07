import mongoose, { Schema } from "mongoose";

const academicsSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  bannerImage: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: false,
  },
  status: {
    type: Boolean,
    required: true,
  },
});

export const Academics = mongoose.model("Academic", academicsSchema);
