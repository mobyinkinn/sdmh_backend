import { Opinions } from "../models/opinion.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createOpinion = asyncHandler(async (req, res) => {
  const { name, phone, email, speciality, text } = req.body;

  if (!name) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  // Check if images are provided
  const images = [];
  if (!req.files?.images || req.files.images.length === 0) {
    throw new ApiError(400, "Images are required");
  }

  // Iterate through each file and upload
  for (let i = 0; i < req.files.images.length; i++) {
    const fileLocalPath = req.files.images[i].path;

    const image = await uploadOnCloudinary(fileLocalPath);
    if (!image) {
      throw new ApiError(500, "Something went wrong while uploading the image");
    }
    images.push(image.url);
  }

  // Ensure at least one image is uploaded
  if (images.length === 0) {
    throw new ApiError(500, "Something went wrong while uploading the images");
  }

  // Check if opinion with the same name already exists
  const exsisting = await Opinions.find({ name });
  if (exsisting.length > 1) {
    throw new ApiError(400, "Entry already exists, please change the name!!!");
  }

  // Create new opinion
  const Opinion = await Opinions.create({
    name,
    phone,
    email,
    speciality,
    images: images,
    text,
  });

  if (!Opinion) {
    throw new ApiError(
      400,
      "Something went wrong while creating the opinion!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Opinion, "Opinion created!!!"));
});


const getAllOpinions = asyncHandler(async (req, res) => {
  const opinions = await Opinions.find();

  if (!opinions) {
    throw new ApiError(500, "Something went wrong!!!");
  }

  res.status(200).json(new ApiResponse(200, "Opinions found!!!", opinions));
});

const deleteOpinion = asyncHandler(async (req, res) => {
  const opinion = await Opinions.findById(req.query.id);
  if (!opinion) {
    throw new ApiError(400, "No opinion found!!!");
  }

  const deletedOpinion = await Opinions.findByIdAndDelete(req.query.id);
  if (!deletedOpinion) {
    throw new ApiError(
      400,
      "Something went wrong while deleting the opinion!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Opinion deleted!!!"));
});

export { createOpinion, getAllOpinions, deleteOpinion };
