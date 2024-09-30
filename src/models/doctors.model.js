import mongoose, { mongo, Schema } from "mongoose";

const doctorSchema = new Schema(
  {
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
    department: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    availablity: {
      type: [String],
      required: true,
    },
    floor: {
      type: String,
      required: false,
      trim: true,
    },
    room: {
      type: String,
      required: false,
      trim: true,
    },
    about: {
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

export const doctor = mongoose.model("doctor", doctorSchema);
