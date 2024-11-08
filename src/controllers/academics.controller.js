import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Academics } from "../models/academics.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createAcademics = asyncHandler(async (req, res) => {
  const { name, content, status } = req.body;

  if (!name || !content || !status) {
    throw new ApiError(400, "Please fill the required fields");
  }

  const existingAcademics = await Academics.findOne({ name });

  if (existingAcademics) {
    throw new ApiError(400, "Academics already exists!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  const bannerImageLocalPath = req.files?.bannerImage[0].path;

  if (!imageLocalPath || !bannerImageLocalPath) {
    throw new ApiError(400, "Images are required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  const bannerImage = await uploadOnCloudinary(bannerImageLocalPath);

  if (!image || !bannerImage) {
    throw new ApiError(500, "Image failed to upload!!!");
  }

  const academics = await Academics.create({
    name,
    image: image.url,
    bannerImage: bannerImage.url,
    status,
    content,
  });

  const createdAcademics = await Academics.findById(academics._id);

  if (!createdAcademics) {
    throw new ApiError(
      500,
      "Something went wrong while creating the department!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdAcademics, "Academics created!!!"));
});

const getAllAcademics = asyncHandler(async (req, res) => {
  const allAcademics = await Academics.find({});

  return res
    .status(200)
    .json(new ApiResponse(200, allAcademics, "Academics sent!!!"));
});

const updateAcademics = asyncHandler(async (req, res) => {
  const { name, content, status } = req.body;

  if (!req.query.id) {
    throw new ApiError(400, "Please enter the id of the academics!!!");
  }

  const searchAcademic = await Academics.findById(req.query.id);

  if (!searchAcademic) {
    throw new ApiError(
      400,
      "No such academic found, please check the id again and enter!!!"
    );
  }

  if (!name && !content && !status) {
    throw new ApiError(400, "All fields are empty!!!");
  }

  const updatedAcademics = await Academics.findByIdAndUpdate(
    req.query.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedAcademics, "Academics updated successfully")
    );
});

const deleteAcademics = asyncHandler(async (req, res) => {
  const deletedAcademics = await Academics.findByIdAndDelete(req.query.id);

  res
    .status(200)
    .json(new ApiResponse(200, "Academic deleted successfully!!!"));
});

const getAcademics = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) {
    throw new ApiError(400, "Enter the academics name");
  }

  const academics = await Academics.find(req.body);

  if (!academics) {
    throw new ApiError(400, "Academic not found!!!");
  }

  res.status(200).json(new ApiResponse(200, "Academics data sent", academics));
});

const getById = asyncHandler(async (req, res) => {
  if (!req.query.id) {
    throw new ApiError(400, "Please provide the required id!!!");
  }
  const academics = await Academics.findById(req.query.id);

  if (!academics) {
    throw new ApiError(400, "No academic found!!!");
  }

  res.status(200).json(new ApiResponse(200, "Academic found", academics));
});

export {
  createAcademics,
  getAllAcademics,
  getById,
  updateAcademics,
  deleteAcademics,
  getAcademics,
};
