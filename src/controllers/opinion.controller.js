import { Opinions } from "../models/opinion.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createOpinion = asyncHandler(async (req, res) => {
  const { name, phone, email, speciality } = req.body;
  if (!name) {
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

  const exsisting = await Opinions.find({ name });
  if (exsisting.length > 1) {
    throw new ApiError(400, "Entry already exists, please change the name!!!");
  }

  const Opinion = await Opinions.create({
    name,
    phone,
    email,
    speciality,
    file: file.url,
  });

  if (!Opinion) {
    throw new ApiError(
      400,
      "Something went wrong while creating the opinion!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Opinion, "Opinion created!!!"));
});

const getAllOpinions = asyncHandler(async (req, res) => {
  const opinions = await Opinions.find();

  if (!opinions) {
    throw new ApiError(500, "Something went wrong!!!");
  }

  res.status(200).json(new ApiResponse(200, "Opinions found!!!", opinions));
});

const deleteOpinion = asyncHandler(async (req, res) => {
  const opinion = await Opinions.findById(req.query.id);
  if (!opinion) {
    throw new ApiError(400, "No opinion found!!!");
  }

  const deletedOpinion = await Opinions.findByIdAndDelete(req.query.id);
  if (!deletedOpinion) {
    throw new ApiError(
      400,
      "Something went wrong while deleting the opinion!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Opinion deleted!!!"));
});

export { createOpinion, getAllOpinions, deleteOpinion };
