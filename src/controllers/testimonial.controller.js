import { Testimonial } from "../models/testimonial.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTestimonial = asyncHandler(async (req, res) => {
  const { name, designation, status, message } = req.body;

  if (!name || !message) {
    throw new ApiError(400, "Please fill teh required fields!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Image failed to upload!!!");
  }

  const testimonial = await Testimonial.create({
    name,
    designation: designation || undefined,
    status,
    message,
    image: image.url || undefined,
  });

  if (!testimonial) {
    throw new ApiError(
      500,
      "Something went wrong while creating the testimonial!!!"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Testimonial created successfull", { testimonial })
    );
});

const getAllTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find();
  if (!testimonials) {
    throw new ApiError(500, "Something went wrong while creating the order!!!");
  }

  res.status(200).json(new ApiResponse(200, "Testimonials sent!!"));
});

const deleteTestimonial = asyncHandler(async (req, res) => {
  const isAvailable = await Testimonial.findById(req.query.id);
  if (!isAvailable) {
    throw new ApiError(400, "Testimonial not found!!!");
  }

  const deletedTestimonial = await Testimonial.findByIdAndDelete(req.query.id);

  if (!deletedTestimonial) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the testimonial!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Testimonial deleted successfully!!!"));
});

export { createTestimonial, deleteTestimonial, getAllTestimonials };
