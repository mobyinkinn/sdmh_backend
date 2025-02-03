import mongoose, { Schema } from "mongoose";

const opinionSchema = new Schema(
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
    speciality: {
      type: String,
      required: true,
      trim: true,
    },
    file: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Opinions = mongoose.model("Opinions", opinionSchema);
