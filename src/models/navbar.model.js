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
    items: [
      {
        subItemOrderId: { type: Number, required: true },
        itemName: { type: String, required: true },
        itemLink: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Navbar = mongoose.model("Navbar", navbarSchema);
