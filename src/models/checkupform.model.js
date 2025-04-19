import mongoose, { Schema } from "mongoose";

const checkupformSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    planname: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Checkups = mongoose.model("Checkups", checkupformSchema);
