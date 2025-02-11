import { Awards } from "../models/awards.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createAward = asyncHandler(async (req, res) => {
  const { name, about, status, year, smallDescription } = req.body;

  if (!name || !about || !year || !smallDescription) {
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

  const bannerLocalPath = req.files?.banner[0]?.path;
  if (!bannerLocalPath) {
    throw ApiError(400, "Banner is required!!!");
  }
  const banner = await uploadOnCloudinary(bannerLocalPath);
  if (!banner) {
    throw new ApiError(500, "Banner failed to upload!!!");
  }

  const images = [];

  if (req.files?.images.length === 0) {
    throw new ApiError(400, "Images are requried");
  }

  for (let i = 0; i < req.files.images.length; i++) {
    const image = await uploadOnCloudinary(req.files.images[i].path);
    if (!image) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the images"
      );
    }
    images.push(image.url);
  }

  if (images.length === 0) {
    throw new ApiError(500, "Something went wrong while uploading the images");
  }

  const fetchedAward = await Awards.findOne({ name });
  if (fetchedAward) {
    throw new ApiError(400, "Award already Exists!!!");
  }

  const award = await Awards.create({
    name,
    image: image.url,
    bannerImage: banner.url,
    about,
    year,
    status,
    smallDescription,
    images: images,
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
  const { name, about, year, status, smallDescription } = req.body;

  const isAward = await Awards.findById(req.query.id);
  if (!isAward) {
    throw new ApiError(400, "Award not found!!!");
  }

  const filter = {};
  if (name) filter.name = name;
  if (about) filter.about = about;
  if (year) filter.year = year;
  if (status) filter.status = status;
  if (smallDescription) filter.smallDescription = smallDescription;

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

const getAwardById = asyncHandler(async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    throw new ApiError(400, "Award is required!!!");
  }

  const award = await Awards.findOne({ _id });
  if (!award) {
    throw new ApiError(400, "No Award found");
  }

  res.status(200).json(new ApiResponse(200, "Award by id!!!", award));
});

const updateImages = asyncHandler(async (req, res) => {
  const award = await Awards.findById(req.query.id);
  if (!award) {
    throw new ApiError(400, "No such award exists!!!");
  }
  const images = [];

  if (req.files?.images.length === 0) {
    throw new ApiError(400, "Images are requried");
  }

  for (let i = 0; i < req.files.images.length; i++) {
    const image = await uploadOnCloudinary(req.files.images[i].path);
    if (!image) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the images"
      );
    }
    images.push(image.url);
  }

  if (images.length === 0) {
    throw new ApiError(500, "Something went wrong while uploading the images");
  }

  const updatedAward = await Awards.findByIdAndUpdate(
    req.query.id,
    { images: images },
    { new: true }
  );

  if (!updatedAward) {
    throw new ApiError(
      500,
      "Something went wrong while updating the Awards!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Award found", updatedAward));
});

const updateBanner = asyncHandler(async (req, res) => {
  const available = await Awards.findById(req.query.id);
  if (!available) {
    throw new ApiError(400, "No award found");
  }

  const bannerLocalPath = req.files?.banner[0]?.path;
  const banner = await uploadOnCloudinary(bannerLocalPath);

  const updatedAward = await Awards.findByIdAndUpdate(
    req.query.id,
    { $set: { bannerImage: banner.url } },
    { new: true }
  );
  if (!updatedAward) {
    throw new ApiError(500, "Something went wrone while updating award banner");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Award banner updated successfully", updatedAward)
    );
});

const deleteImage = asyncHandler(async (req, res) => {
  const award = await Awards.findById(req.query.id);
  const { index } = req.body;

  if (!award) {
    throw new ApiError(400, "No award found!!!");
  }

  if (!index) {
    throw new ApiError(400, "Index is required!!!");
  }

  const images = award.images;
  if (images.length <= 1) {
    throw new ApiError(400, "Images can not be 0, add more images to delete.");
  }

  images.splice(index, 1);
  const updatedImage = await Awards.findByIdAndUpdate(
    req.query.id,
    { $set: { images } },
    { new: true }
  );

  if (!updatedImage) {
    throw new ApiError(500, "Something went while updating the event!!!");
  }

  res.status(200).json(new ApiResponse(200, "Image deleted.", updatedImage));
});

export {
  createAward,
  getAllAwards,
  updateAward,
  updateImage,
  deleteAward,
  getAwardById,
  updateImages,
  updateBanner,
  deleteImage,
};
