import mongoose, { Schema } from "mongoose";

const navbarSchema = new Schema(
  {
    orderId: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Navbar = mongoose.model("Navbar", navbarSchema);
