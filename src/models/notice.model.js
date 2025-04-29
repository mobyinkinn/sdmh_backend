import mongoose, { Schema } from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: false,
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: "Department",
      required: false,
    },
    file: {
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

export const Notices = mongoose.model("Notice", noticeSchema);
