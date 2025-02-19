import mongoose, { Schema } from "mongoose";

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: [true, "Email address is required"],
      validate: {
        validator: validateEmail,
        message: "Please enter a valid email address",
      },
    },
  },
  { timestamps: true }
);

export const Newsletter = mongoose.model("Newsletter", newsletterSchema);
