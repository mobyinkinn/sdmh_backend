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
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    availablity: {
      type: Map,
      of: String,
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
