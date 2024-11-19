import mongoose, { Schema } from "mongoose";

const tipsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Tips = mongoose.model("Tip", tipsSchema);
