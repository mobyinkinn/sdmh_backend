import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Pages = mongoose.model("Pages", pageSchema);
