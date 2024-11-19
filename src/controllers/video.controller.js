import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const createVideo = asyncHandler(async (req, res) => {
  const { title, url } = req.body;

  if (!title || !url) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const video = await Video.create(req.body);
  if (!video) {
    throw new ApiError(500, "Something went wrong while creating the video");
  }

  res.status(200).json(new ApiResponse(200, "Video created", video));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find();

  if (!videos) {
    throw new ApiError(500, "Something went wrong fetching the videos");
  }

  res.status(200).json(new ApiResponse(200, "Videos sent", videos));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { title, url } = req.body;
  if (!title && !url) {
    throw new ApiError(400, "All fields are empty!!!");
  }

  const video = await Video.findById(req.query.id);
  if (!video) {
    throw new ApiError(400, "Video not found!!!");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    req.query.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new ApiError(500, "Something went wrong while updating the video!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Video updated successfully", updatedVideo));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = Video.findById(req.query.id);
  if (!video) {
    throw new ApiError(400, "No video found!!!");
  }

  const deletedVideo = Video.findByIdAndDelete(req.query.id);
  if (!deletedVideo) {
    throw new ApiError(500, "Something went wrong while deleting the video!!!");
  }

  res.status(200).json(new ApiResponse(200, "Video deleted successfully"));
});

export { createVideo, getAllVideos, updateVideo, deleteVideo };
