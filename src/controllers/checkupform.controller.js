import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnLocalServer } from "../utils/cloudinary.js";
import { Checkups } from "../models/checkupform.model.js";

const createCheckup = asyncHandler(async (req, res) => {
  const { name, phone, email, text, planname } = req.body;
  if (!name) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const exsisting = await Checkups.find({ name });
  if (exsisting.length > 1) {
    throw new ApiError(400, "Entry already exists, please change the name!!!");
  }

  const Checkup = await Checkups.create({
    name,
    phone,
    email,
    text,
    planname,
  });

  if (!Checkup) {
    throw new ApiError(
      400,
      "Something went wrong while creating the Checkup!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Checkup, "Checkup created!!!"));
});

const getAllCheckups = asyncHandler(async (req, res) => {
  const Checkup = await Checkups.find();

  if (!Checkup) {
    throw new ApiError(500, "Something went wrong!!!");
  }

  res.status(200).json(new ApiResponse(200, "Checkups found!!!", Checkups));
});

const deleteCheckup = asyncHandler(async (req, res) => {
  const Checkup = await Checkups.findById(req.query.id);
  if (!Checkup) {
    throw new ApiError(400, "No Checkup found!!!");
  }

  const deletedCheckup = await Checkups.findByIdAndDelete(req.query.id);
  if (!deletedCheckup) {
    throw new ApiError(
      400,
      "Something went wrong while deleting the Checkup!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Checkup deleted!!!"));
});

export { createCheckup, getAllCheckups, deleteCheckup };
