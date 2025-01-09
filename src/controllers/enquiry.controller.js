import { Enquiry } from "../models/enquiry.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createEnquiry = asyncHandler(async (req, res) => {
  const { name, phone, message, date, email } = req.body;
console.log("re",req.body)
  if (!name || !phone || !message || !date || !email) {
    throw new ApiError(400, "Plese fill the required fields!!!");
  }

  const enquiry = await Enquiry.create({ name, phone, message, date, email });

  if (!enquiry) {
    throw new ApiError(500, "Something went wrong while creating the enquiry");
  }

  res.status(200).json(new ApiResponse(200, "Enquire created!!!", enquiry));
});

const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find();

  if (!enquiries) {
    throw new ApiError(500, "Something went wrong!!!");
  }

  res.status(200).json(new ApiResponse(200, "Enquiries found!!!", enquiries));
});

const deleteEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.findById(req.query.id);
  if (!enquiry) {
    throw new ApiError(400, "No enquiry found!!!");
  }

  const deletedEnquiry = await Enquiry.findByIdAndDelete(req.query.id);
  if (!deletedEnquiry) {
    throw new ApiError(
      400,
      "Something went wrong while deleting the enquiry!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Enquiry deleted!!!"));
});

export { createEnquiry, getAllEnquiries, deleteEnquiry };
