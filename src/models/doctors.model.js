import mongoose, { Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    order: {
      type: Number,
      required: true,
      trim: true,
    },
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
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    availablity: {
      type: Map,
      of: String,
      required: true,
    },
    floor: {
      type: String,
      trim: true,
    },
    room: {
      type: String,
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

export const Doctor = mongoose.model("Doctor", doctorSchema);
