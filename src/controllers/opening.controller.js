import { Openings } from "../models/opening.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createOpening = asyncHandler(async (req, res) => {
  const { position, seats, lastDate, programmer, number, jd, status } =
    req.body;
console.log("re",req.body)
  if (!position || !seats || !lastDate || !programmer || !number || !jd) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const createdOpening = await Openings.create({
    position,
    seats,
    lastDate,
    programmer,
    number,jd,status
  });
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
const getOpeningById = asyncHandler(async (req, res) => {
  if (!req.query.id) {
    throw new ApiError(400, "Please provide the required id!!!");
  }
  const opening = await Openings.findById(req.query.id);

  if (!opening) {
    throw new ApiError(400, "No Opening found!!!");
  }

  res.status(200).json(new ApiResponse(200, "Opening found", opening));
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


const blockOpening = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const opening = await Openings.findById(id);
  if (!opening) {
    throw new ApiError(400, "opening not found!!!");
  }

  // Update the status to false (blocked)
  opening.status = false;

  const updatedOpening = await opening.save();
  if (!updatedOpening) {
    throw new ApiError(
      500,
      "Something went wrong while blocking the Opneing!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "Opneing blocked successfully!!!", {
      Openings: updatedOpening,
    })
  );
});

// Unblock Testimonial function
const unblockOpening = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const opening = await Openings.findById(id);
  if (!opening) {
    throw new ApiError(400, "Opening not found!!!");
  }

  // Update the status to true (unblocked)
  opening.status = true;

  const updatedOpening = await opening.save();
  if (!updatedOpening) {
    throw new ApiError(
      500,
      "Something went wrong while unblocking the Opening!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "Opening unblocked successfully!!!", {
      opening: updatedOpening,
    })
  );
});
export {
  createOpening,
  getAllOpenings,
  updateOpening,
  deleteOpening,
  blockOpening,
  unblockOpening,
  getOpeningById,
};
