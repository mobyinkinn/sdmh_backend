import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Newspress } from "../models/newspress.model.js";

const getAllNewspress = asyncHandler(async (req, res) => {
  const newspresses = await Newspress.find();
  if (!newspresses) {
    throw new ApiError(500, "Something went wrong while fetching newspresses");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Newspresses fetched successfully", newspresses)
    );
});

const createNewspress = asyncHandler(async (req, res) => {
  const { title, date, tag, link, description, status } = req.body;
  if (!title || !tag || !description || !date) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const existingNewspress = await Newspress.findOne({ title });
  if (existingNewspress) {
    throw new ApiError(400, "Newspress already exists");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Image failed to upload!!!");
  }

  const bannerLocalPath = req.files?.banner[0]?.path;
  if (!bannerLocalPath) {
    throw ApiError(400, "Banner is required!!!");
  }

  const banner = await uploadOnCloudinary(bannerLocalPath);
  if (!banner) {
    throw new ApiError(500, "Banner failed to upload!!!");
  }

  const newspress = await Newspress.create({
    title,
    date,
    tag,
    link,
    description,
    status: status || true,
    image: image.url || undefined,
    banner: banner.url || undefined,
  });

  if (!newspress) {
    throw new ApiError(
      500,
      "Something went wrong while creating the newspress!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Newspress created", newspress));
});

const updateNewspress = asyncHandler(async (req, res) => {
  const { title, date, tag, link, description, status } = req.body;

  if (!title && !date && !tag && !link && !description && status == null) {
    throw new ApiError(400, "All fields are empty");
  }

  const doesExists = await Newspress.findById(req.query.id);
  if (!doesExists) {
    throw new ApiError(400, "No newspress found!!!");
  }
  const updatedNewspress = await Newspress.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );
  if (!updatedNewspress) {
    throw new ApiError(
      500,
      "Something went wrong while updating the newspress!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Newspress updated", updatedNewspress));
});

const deleteNewspress = asyncHandler(async (req, res) => {
  const doesExists = await Newspress.findById(req.query.id);
  if (!doesExists) {
    throw new ApiError(400, "No newspress found!!!");
  }

  const deletedNewspress = await Newspress.findByIdAndDelete(req.query.id);
  if (!deletedNewspress) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the newspress!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Newspress deleted!!!"));
});

const updateImage = asyncHandler(async (req, res) => {
  const doesExists = await Newspress.findById(req.query.id);
  if (!doesExists) {
    throw new ApiError(400, "No newspress found!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Image failed to upload!!!");
  }
  const updatedNewspress = await Newspress.findByIdAndUpdate(
    req.query.id,
    { $set: { image: image.url } },
    { new: true }
  );

  if (!updatedNewspress) {
    throw new ApiError(
      500,
      "Something went wrong while updating the newspress image!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Newspress image updated", updatedNewspress));
});

const updateBanner = asyncHandler(async (req, res) => {
  const doesExists = await Newspress.findById(req.query.id);
  if (!doesExists) {
    throw new ApiError(400, "No newspress found!!!");
  }

  const bannerLocalPath = req.files?.banner[0]?.path;
  if (!bannerLocalPath) {
    throw new ApiError(400, "Banner is required!!!");
  }

  const banner = await uploadOnCloudinary(bannerLocalPath);
  if (!banner) {
    throw new ApiError(500, "Banner failed to upload!!!");
  }

  const updatedNewspress = await Newspress.findByIdAndUpdate(
    req.query.id,
    { $set: { banner: banner.url } },
    { new: true }
  );

  if (!updatedNewspress) {
    throw new ApiError(
      500,
      "Something went wrong while updating the newspress banner!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Newspress banner updated", updatedNewspress));
});

const getNewspressById = asyncHandler(async (req, res) => {
  const newspress = await Newspress.findById(req.query.id);
  if (!newspress) {
    throw new ApiError(400, "No newspress found!!!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Newspress fetched successfully", newspress));
});

export {
  getAllNewspress,
  createNewspress,
  updateNewspress,
  deleteNewspress,
  updateImage,
  updateBanner,
  getNewspressById,
};
