import mongoose, { Schema } from "mongoose";

const tpaSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logo: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const Tpa = mongoose.model("Tpa", tpaSchema);
