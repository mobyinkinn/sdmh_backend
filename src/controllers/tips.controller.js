import { Tips } from "../models/tips.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnLocalServer } from "../utils/cloudinary.js";

const createTip = asyncHandler(async (req, res) => {
  const { title, description, content, status } = req.body;

  if (!title || !description || !content) {
    throw new ApiError(400, "Please fill all the required fields!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnLocalServer(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload!!!");
  }

  const isUnique = await Tips.findOne({ title: title });
  if (isUnique !== null) {
    throw new ApiError(400, "Tip already exists!!!");
  }

  const tip = await Tips.create({
    title,
    description,
    content,
    status,
    image: image.url,
  });

  if (!tip) {
    throw new ApiError(
      500,
      "Something went wrong while creating the health tip!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Health tip created successfully!!!", tip));
});

const getAllTips = asyncHandler(async (req, res) => {
  const tips = await Tips.find();

  if (!tips) {
    throw new ApiError(500, "Unable to fetch tips!!!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Tips sent successfully!!!!", tips));
});

const updateTip = asyncHandler(async (req, res) => {
  const { title, description, content, status } = req.body;

  if (!title && !description && !content && !status) {
    throw new ApiError(400, "All fields are empty");
  }

  const doesExists = await Tips.findById(req.query.id);
  if (!doesExists) {
    throw new ApiError(400, "No tip found!!!");
  }

  const updatedTip = await Tips.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedTip) {
    throw new ApiError(500, "Something went wrong while updating the tip!!!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Tip updated succesfully!!!", updatedTip));
});

const deleteTip = asyncHandler(async (req, res) => {
  const doesExists = await Tips.findById(req.query.id);
  if (!doesExists) {
    throw new ApiError(400, "No tip found!!!");
  }

  const deletedTip = await Tips.findByIdAndDelete(req.query.id);

  if (!deletedTip) {
    throw new ApiError(500, "Something went wrong while deleting the tip!!!");
  }

  res.status(200).json(new ApiResponse(200, "Tip deleted successfully"));
});

const updateImage = asyncHandler(async (req, res) => {
  const doesExists = await Tips.findById(req.query.id);

  if (!doesExists) {
    throw new ApiError(400, "No tip found!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const image = await uploadOnLocalServer(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload");
  }

  const updatedTip = await Tips.findByIdAndUpdate(
    req.query.id,
    { image: image.url },
    { new: true }
  );

  if (!updatedTip) {
    throw new ApiError(
      500,
      "Something went wrong while updating the tip image!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Tip Image updated", updatedTip));
});

export { createTip, getAllTips, updateTip, deleteTip, updateImage };
