import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donationType: { type: String, required: true },
    amount: { type: Number, required: true },
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },
    state: { type: String },
    city: { type: String },
    address: { type: String },
    zip: { type: String },
    txnId: { type: String, required: true },
  },
  { timestamps: true }
);

export const Donation = mongoose.model("Donation", donationSchema);
