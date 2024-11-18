import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/cloudinary.js";
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

const readVideo = asyncHandle(async (req, res) => {
  const videos = await Video.find();

  if (!videos) {
    throw new ApiError(500, "Something went wrong fetching the videos");
  }

  res.status(200).json(new ApiResponse(200, "Videos sent", videos));
});
