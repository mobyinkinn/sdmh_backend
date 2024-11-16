import { Downloadables } from "../models/downloadables.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createDownloadable = asyncHandler(async (req, res) => {
  const { name, type, status } = req.body;
  if (!name || !type) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const fileLocalPath = req.files.file[0]?.path;
  if (!fileLocalPath) {
    throw new ApiError(400, "Please upload the file!!!");
  }

  const file = await uploadOnCloudinary(fileLocalPath);

  if (!file) {
    throw new ApiError(500, "Failed to upload the file, Please try again!!!");
  }

  const exsisting = await Downloadables.find({ name });
  if (exsisting.length > 1) {
    throw new ApiError(400, "Entry already exists, please change the name!!!");
  }

  const downloadable = await Downloadables.create({
    name,
    type,
    status,
    file: file.url,
  });

  if (!downloadable) {
    throw new ApiError(
      400,
      "Something went wrong while creating the downloadable!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, downloadable, "Downloadable created!!!"));
});

const getAllDownloadables = asyncHandler(async (req, res) => {
  const downloadables = await Downloadables.find();

  if (!downloadables) {
    throw new ApiError(500, "Something went really wrong!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, downloadables, "Downloadables sent!!!"));
});

const updateDownloadables = asyncHandler(async (req, res) => {
  const { name, type, status } = req.body;

  const isDownloadable = await Downloadables.findById(req.query.id);
  if (!isDownloadable) {
    throw new ApiError(400, "No such downloadable exists!!!");
  }

  if (!name && !type && !status) {
    throw new ApiError(400, "All fields are empty");
  }

  const filter = {};
  if (name) filter.name = name;
  if (type) filter.type = type;
  if (status) filter.status = status;

  const updatedDownloadable = await Downloadables.findByIdAndUpdate(
    req.query.id,
    filter,
    { new: true }
  );

  if (!updatedDownloadable) {
    throw new ApiError(500, "Something went wrong while updating!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedDownloadable, "Downloadable updated!!!"));
});

const deleteDownloadables = asyncHandler(async (req, res) => {
  const isDownloadable = await Downloadables.findById(req.query.id);
  if (!isDownloadable) {
    throw new ApiError(400, "No such downloadable exists!!!");
  }

  const deleteDownloadable = await Downloadables.findByIdAndDelete(
    req.query.id
  );

  if (!deleteDownloadable) {
    throw new ApiError(500, "Something went wrong while delete!!!");
  }

  return res.status(200).json(new ApiResponse(200, "Downloadable deleted!!!"));
});

export {
  createDownloadable,
  getAllDownloadables,
  updateDownloadables,
  deleteDownloadables,
};
