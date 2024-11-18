import { Awards } from "../models/awards.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createAward = asyncHandler(async (req, res) => {
  const { name, about, status, year } = req.body;

  if (!name || !about || !year) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload!!!");
  }

  const fetchedAward = await Awards.findOne({ name });
  if (fetchedAward) {
    throw new ApiError(400, "Award already Exists!!!");
  }

  const award = await Awards.create({
    name,
    image: image.url,
    about,
    year,
    status,
  });

  if (!award) {
    throw new ApiError(500, "Somehing went wrong while creating the award");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, award, "Award created successfully!!!"));
});

const getAllAwards = asyncHandler(async (req, res) => {
  const allAwards = await Awards.find();

  return res
    .status(200)
    .json(new ApiResponse(200, allAwards, "Awards sent successfully!!!"));
});

const updateAward = asyncHandler(async (req, res) => {
  const { name, about, year, status } = req.body;

  const isAward = await Awards.findById(req.query.id);
  if (!isAward) {
    throw new ApiError(400, "Award not found!!!");
  }

  const filter = {};
  if (name) filter.name = name;
  if (about) filter.about = about;
  if (year) filter.year = year;
  if (status) filter.status = status;

  const updatedAward = await Awards.findByIdAndUpdate(
    req.query.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!updatedAward) {
    throw new ApiError(500, "SOmething went wrong while updating awards!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Awards updated successfully!!!", updatedAward));
});

const updateImage = asyncHandler(async (req, res) => {
  const award = await Awards.findById(req.query.id);
  if (!award) {
    throw new ApiError(400, "No such doctor exists!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload");
  }

  const updatedAward = await Awards.findByIdAndUpdate(
    req.query.id,
    { image: image.url },
    { new: true }
  );

  if (!updatedAward) {
    throw new ApiError(
      500,
      "Something went wrong while updating the doctor!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Doctor found", updatedAward));
});

const deleteAward = asyncHandler(async (req, res) => {
  const award = await Awards.findById(req.query.id);
  if (!award) {
    throw new ApiError(400, "No awards found");
  }

  const deletedAward = await Awards.findByIdAndDelete(req.query.id);
  if (!deletedAward) {
    throw new ApiError(500, "Something went wrong while deleting the Award!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Award deleted successfully!!!"));
});

export { createAward, getAllAwards, updateAward, updateImage, deleteAward };
