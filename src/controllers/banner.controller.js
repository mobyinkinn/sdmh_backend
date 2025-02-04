import { Banner } from "../models/banner.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBanner = asyncHandler(async (req, res) => {
  const { page, status, link } = req.body;
  console.log("Req Body:", req.body);

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

  const localMobileBannerPath = req.files?.mobileBanner[0]?.path;
  if (!localMobileBannerPath) {
    throw new ApiError(400, "Mobile banner image is required!!!");
  }
  const mobileBannerUrl = await uploadOnCloudinary(localMobileBannerPath);
  if (!mobileBannerUrl) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the mobile banner!!!"
    );
  }

  const banner = await Banner.create({
    page,
    banner: bannerUrl.url,
    mobileBanner: mobileBannerUrl.url,
    link,
    status,
  });

  if (!banner) {
    throw new ApiError(
      500,
      "Something went wrong while creating the banner!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Banner created successfully!!!", banner));
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
  const { link } = req.body;

  if (!page) {
    throw new ApiError(400, "Page is required!!!");
  }

  const banner = await Banner.findOne({ page });
  if (!banner) {
    throw new ApiError(404, "No banner found for this page!!!");
  }

  const updateFields = {};

  if (req.files?.banner) {
    const localBannerPath = req.files.banner[0]?.path;
    if (localBannerPath) {
      const bannerUrl = await uploadOnCloudinary(localBannerPath);
      if (!bannerUrl) {
        throw new ApiError(
          500,
          "Something went wrong while uploading the banner!!!"
        );
      }
      updateFields.banner = bannerUrl.url;
    }
  }

  if (req.files?.mobileBanner) {
    const localMobileBannerPath = req.files.mobileBanner[0]?.path;
    if (localMobileBannerPath) {
      const mobileBannerUrl = await uploadOnCloudinary(localMobileBannerPath);
      if (!mobileBannerUrl) {
        throw new ApiError(
          500,
          "Something went wrong while uploading the mobile banner!!!"
        );
      }
      updateFields.mobileBanner = mobileBannerUrl.url;
    }
  }

  if (link) {
    updateFields.link = link;
  }

  const updatedBanner = await Banner.findByIdAndUpdate(
    banner._id,
    { $set: updateFields },
    { new: true }
  );

  if (!updatedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while updating the banner!!!"
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

const blockBanner = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(400, "Banner not found!!!");
  }

  // Update the status to false (blocked)
  banner.status = false;

  const updatedBanner = await banner.save();
  if (!updatedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while blocking the Banner!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "Banner blocked successfully!!!", {
      Banner: updatedBanner,
    })
  );
});

// Unblock Banner function
const unblockBanner = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const banner = await Banner.findById(id);
  if (!banner) {
    throw new ApiError(400, "Banner not found!!!");
  }

  // Update the status to true (unblocked)
  banner.status = true;

  const updatedBanner = await banner.save();
  if (!updatedBanner) {
    throw new ApiError(
      500,
      "Something went wrong while unblocking the Banner!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "Banner unblocked successfully!!!", {
      Banner: updatedBanner,
    })
  );
});
export {
  createBanner,
  getAllBanners,
  getBannerByPage,
  updateBanner,
  deleteBanner,
  blockBanner,
  unblockBanner,
};
