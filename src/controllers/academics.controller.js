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

export { createAcademics };
