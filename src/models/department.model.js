import mongoose, { Schema } from "mongoose";

const departmentSchema = new Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      // required: true,
      trim: true,
    },
    bannerImage: {
      type: String,
      // required: true,
      trim: true,
    },
    mobileBanner: {
      type: String,
      // required: true,
      trim: true,
    },
    defaultDepartment: {
      type: Boolean,
      default: false,
    },

    homeImage: {
      type: String,
      // required: true,
      trim: true,
    },
    content: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);
