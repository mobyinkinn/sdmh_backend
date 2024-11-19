import { Openings } from "../models/opening.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOpening = asyncHandler(async (req, res) => {
  const { position, seats, lastDate, programmer, number, jd, status } =
    req.body;

  if (!position || !seats || !lastDate || !programmer || !number || !jd) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const createdOpening = await Openings.create(req.body);
  if (!createdOpening) {
    throw new ApiError(
      500,
      "Something went wrong while creating the opening!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Opening created!!!", createdOpening));
});

const getAllOpenings = asyncHandler(async (req, res) => {
  const openings = await Openings.find();

  if (!openings) {
    throw new ApiError(500, "Something went wrong while finding the oepnings");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Openings sent!!!", openings));
});

const updateOpening = asyncHandler(async (req, res) => {
  const { position, seats, lastDate, programmer, number, jd } = req.body;
  if (!position && !seats && !lastDate && !programmer && !number && !jd) {
    throw new ApiError(400, "All fields are empty!!!");
  }

  const isOpening = await Openings.findById(req.query.id);
  if (!isOpening) {
    throw new ApiError(400, "No opening found");
  }
  console.log(isOpening);

  const updatedOpening = await Openings.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedOpening) {
    throw new ApiError(
      500,
      "Something went wrong while updating the opening!!!"
    );
  }

  res.status(200).json(new ApiError(200, "Opening updated!!!", updatedOpening));
});

const deleteOpening = asyncHandler(async (req, res) => {
  const isOpening = await Openings.findById(req.query.id);
  if (!isOpening) {
    throw new ApiError(400, "No opening found");
  }

  const deletedOpening = await Openings.findByIdAndDelete(req.query.id);

  if (!deletedOpening) {
    throw new ApiError(
      400,
      "Something went wrong while deleting the opening!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Opening deleted!!!"));
});

export { createOpening, getAllOpenings, updateOpening, deleteOpening };
