import { Checkup } from "../models/checkup.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createCheckup = asyncHandler(async (req, res) => {
  const { title, status, description } = req.body;
  if (!title || !description) {
    throw new ApiError(400, "Please fill all the required fields!!!");
  }

  const unique = await Checkup.findOne({ title });
  if (unique) {
    throw new ApiError(400, "Checkup already exists!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is requried");
  }
  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Something went wrong while uploading the image");
  }

  const bannerLocalPath = req.files?.banner[0]?.path;
  if (!bannerLocalPath) {
    throw newApiError(400, "Banner is required!!!");
  }
  const banner = await uploadOnCloudinary(bannerLocalPath);

  const checkup = await Checkup.create({
    title,
    description,
    status,
    image: image.url,
    bannerImage: banner.url,
  });

  if (!checkup) {
    throw new ApiError(
      500,
      "Something went wrong while creating the checkup!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Checkup created successfully!!!", checkup));
});

const getAllCheckups = asyncHandler(async (req, res) => {
  const checkups = await Checkup.find();
  if (!checkups) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the checkups!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Checkup fetched successfylly", checkups));
});

const deleteCheckup = asyncHandler(async (req, res) => {
  const available = await Checkup.findById(req.query.id);
  if (!available) {
    throw new ApiError(400, "No checkup found!!!");
  }

  const deletedCheckup = await Checkup.findByIdAndDelete(req.query.id);
  if (!deletedCheckup) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the checkup!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Checkup deleted successfully!!!"));
});

const updateImage = asyncHandler(async (req, res) => {
  const available = await Checkup.findById(req.query.id);
  if (!available) {
    throw new ApiError(400, "No checkup found");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  const image = await uploadOnCloudinary(imageLocalPath);

  const updatedCheckup = await Checkup.findByIdAndUpdate(
    req.query.id,
    { $set: { image: image.url } },
    { new: true }
  );
  if (!updatedCheckup) {
    throw new ApiError(
      500,
      "Something went wrone while updating checkup image"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Checkup Image updated successfully", updatedCheckup)
    );
});

const updateBanner = asyncHandler(async (req, res) => {
  const available = await Checkup.findById(req.query.id);
  if (!available) {
    throw new ApiError(400, "No checkup found");
  }

  const bannerLocalPath = req.files?.banner[0]?.path;
  const banner = await uploadOnCloudinary(bannerLocalPath);

  const updatedCheckup = await Checkup.findByIdAndUpdate(
    req.query.id,
    { $set: { bannerImage: banner.url } },
    { new: true }
  );
  if (!updatedCheckup) {
    throw new ApiError(
      500,
      "Something went wrone while updating checkup banner"
    );
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Checkup banner updated successfully",
        updatedCheckup
      )
    );
});

const updateCheckup = asyncHandler(async (req, res) => {
  const { title, status, description } = req.body;

  const available = await Checkup.findById(req.query.id);
  if (!available) {
    throw new ApiError(400, "Checkup not found!!!");
  }

  if (!status && !title && !description) {
    throw new ApiError(400, "All fields are empty!!!");
  }

  const updatedCheckup = await Checkup.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );
  if (!updatedCheckup) {
    throw new ApiError(500, "Something went wrong while updating the website");
  }

  res.status(200).json(new ApiResponse(200, "Checkup updated", updatedCheckup));
});

export {
  createCheckup,
  deleteCheckup,
  getAllCheckups,
  updateBanner,
  updateImage,
  updateCheckup,
};
