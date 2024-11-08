import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tpa } from "../models/tpa.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createTpa = asyncHandler(async (req, res) => {
  const { name, status } = req.body;

  if (!name || !status) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const existingTpa = await Tpa.findOne({ name });
  if (existingTpa) {
    throw new ApiError(400, "Tpa already exists");
  }

  console.log(req.files);
  const imageLocalPath = req.files?.logo[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Logo is required");
  }

  const logo = await uploadOnCloudinary(imageLocalPath);

  if (!logo) {
    throw new ApiError(500, "Something went wrong while uploading the logo");
  }

  const tpa = await Tpa.create({
    name,
    status,
    logo: logo.url,
  });

  const createdTpa = await Tpa.findById(tpa._id);

  res.status(200).json(new ApiResponse(200, "Tpa created", createdTpa));
});

const getAllTpas = asyncHandler(async (req, res) => {
  const tpas = await Tpa.find();

  res.status(200).json(new ApiResponse(200, "Tpa data sent", tpas));
});

const updateTpa = asyncHandler(async (req, res) => {
  const { name, status } = req.body;

  if (!req.query.id) {
    throw new ApiError(400, "Please provide the tpa id");
  }

  const tpa = await Tpa.findById(req.query.id);

  if (!tpa) {
    throw new ApiError(400, "No such tpa exists");
  }

  if (!name && !status) {
    throw new ApiError(400, "Please fill the required fields");
  }

  const updatedTpa = await Tpa.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTpa, "Tpa updated successfully"));

  res.status(200).json(200, "Tpa updated successfully");
});

const getTpa = asyncHandler(async (req, res) => {
  const { id, name } = req.body;

  if (!id && !name) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  const filter = {};

  if (id) filter._id = id;
  if (name) filter.name = name;

  const tpa = await Tpa.find(filter);

  if (!tpa) {
    throw new ApiError(400, "No tpa found");
  }

  res.status(200).json(new ApiResponse(200, "Tpa found", tpa));
});

export { createTpa, getAllTpas, updateTpa, getTpa };
