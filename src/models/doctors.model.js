import mongoose, { Schema } from "mongoose";

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
      type: [Object],
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

export const Doctor = mongoose.model("Doctor", doctorSchema);
