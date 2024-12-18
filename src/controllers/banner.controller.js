import { Banner } from "../models/banner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBanner = asyncHandler(async (req, res) => {
  const { page } = req.body;
  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const existingBanner = await Banner.findOne({ page });
  if (existingBanner) {
    throw new ApiError(400, "Banner for this page already exists!!!");
  }

  const localBannerPath = req.files?.banner[0]?.path;
  if (!localBannerPath) {
    throw new ApiError(400, "Banner image is required!!!");
  }

  const bannerUrl = await uploadOnCloudinary(localBannerPath);
  if (!bannerUrl) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the banner!!!"
    );
  }

  const banner = await Banner.create({ page, banner: bannerUrl.url });
  if (!banner) {
    throw new ApiError(
      500,
      "Something went wrong while creating the banner!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Banner created successfullly!!!", banner));
});

const getAllBanners = asyncHandler(async (req, res) => {
  const banners = await Banner.find();
  if (!banners) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the banners!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Banners fetched successfully!!!", banners));
});

const getBannerByPage = asyncHandler(async (req, res) => {
  const { page } = req.query;

  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const banner = await Banner.findOne({ page });
  if (!banner) {
    throw new ApiError(400, "No banner found");
  }

  res.status(200).json(new ApiResponse(200, "Banner sent!!!", banner));
});

const updateBanner = asyncHandler(async (req, res) => {
  const { page } = req.query;

  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const banner = await Banner.findOne({ page });
  if (!banner) {
    throw new ApiError(400, "No banner found");
  }

  const localBannerPath = req.files?.banner[0]?.path;
  if (!localBannerPath) {
    throw new ApiError(400, "Banner image is required!!!");
  }

  const bannerUrl = await uploadOnCloudinary(localBannerPath);
  if (!bannerUrl) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the banner!!!"
    );
  }

  const updatedBanner = await Banner.findByIdAndUpdate(
    banner._id,
    {
      $set: { banner: bannerUrl.url },
    },
    { new: true }
  );
  if (!updatedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while creating the banner!!!"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Banner updated successfully!!!", updatedBanner)
    );
});

const deleteBanner = asyncHandler(async (req, res) => {
  const { page } = req.query;

  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const banner = await Banner.findOne({ page });
  if (!banner) {
    throw new ApiError(400, "No banner found");
  }

  const deletedBanner = await Banner.findByIdAndDelete(banner._id);
  if (!deletedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the banner!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Banner deleted successfully!!!"));
});

export {
  createBanner,
  getAllBanners,
  getBannerByPage,
  updateBanner,
  deleteBanner,
};
