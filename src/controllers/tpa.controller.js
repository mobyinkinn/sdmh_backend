import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tpa } from "../models/tpa.model.js";
import { uploadOnLocalServer } from "../utils/cloudinary.js";

const createTpa = asyncHandler(async (req, res) => {
  const { name, status, tag } = req.body;

  if (!name || !status || !tag) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const existingTpa = await Tpa.findOne({ name });
  if (existingTpa) {
    throw new ApiError(400, "Tpa already exists");
  }

  const imageLocalPath = req.files?.logo[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Logo is required");
  }
 const logo = await uploadOnLocalServer(
   imageLocalPath,
   req.files?.logo[0]?.originalname
 );
 if (!logo) throw new ApiError(500, "Failed to upload image");

  // const logo = await uploadOnLocalServer(imageLocalPath);

  const tpa = await Tpa.create({
    name,
    status,
    tag,
    logo: logo.url,
  });

  const createdTpa = await Tpa.findById(tpa._id);

  res.status(200).json(new ApiResponse(200, "Tpa created", createdTpa));
});

const getAllTpas = asyncHandler(async (req, res) => {
  const tpas = await Tpa.find();

  res.status(200).json(new ApiResponse(200, "Tpa data sent", tpas));
});

const updateTpa = asyncHandler(async (req, res) => {
  const { name, status, tag } = req.body;

  if (!req.query.id) {
    throw new ApiError(400, "Please provide the tpa id");
  }

  const tpa = await Tpa.findById(req.query.id);

  if (!tpa) {
    throw new ApiError(400, "No such tpa exists");
  }

  if (!name) {
    throw new ApiError(400, "Please fill the required fields");
  }

  const updatedTpa = await Tpa.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedTpa, "Tpa updated successfully"));

});
const deleteTpa = asyncHandler(async (req, res) => {
  const exists = await Tpa.findById(req.query.id);
  if (!exists) {
    throw new ApiError(400, "No event found");
  }

  const deletedTpa = await Tpa.findByIdAndDelete(req.query.id);

  if (!deletedTpa) {
    throw new ApiError(500, "Something went wrong while deleting the tpa");
  }

  res.status(200).json(new ApiResponse(200, "Event deleted successfully"));
});

const blockTpa = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const tpa = await Tpa.findById(id);
  if (!tpa) {
    throw new ApiError(400, "Tpa not found!!!");
  }

  // Update the status to false (blocked)
  tpa.status = false;

  const updatedTpa = await tpa.save();
  if (!updatedTpa) {
    throw new ApiError(500, "Something went wrong while blocking the blogs!!!");
  }

  res.status(200).json(
    new ApiResponse(200, "blog blocked successfully!!!", {
      tpa: updatedTpa,
    })
  );
});

// Unblock Testimonial function
const unblockTpa = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const tpa = await Tpa.findById(id);
  if (!tpa) {
    throw new ApiError(400, "Tpa not found!!!");
  }

  // Update the status to true (unblocked)
  tpa.status = true;

  const updatedTpa = await tpa.save();
  if (!updatedTpa) {
    throw new ApiError(500, "Something went wrong while unblocking the Tpa!!!");
  }

  res.status(200).json(
    new ApiResponse(200, "blog unblocked successfully!!!", {
      tpa: updateTpa,
    })
  );
});
const getTpa = asyncHandler(async (req, res) => {
  const { id, name } = req.body;

  if (!id && !name) {
    throw new ApiError(400, "Please fill all the required fields");
  }

  const filter = {};

  if (id) filter._id = id;
  if (name) filter.name = name;

  const tpa = await Tpa.find(filter);

  if (!tpa) {
    throw new ApiError(400, "No tpa found");
  }

  res.status(200).json(new ApiResponse(200, "Tpa found", tpa));
});

const updateLogo = asyncHandler(async (req, res) => {
  const id = req.query.id;
  if (!id) {
    throw new ApiError(400, "Id is required!!!");
  }

  const tpa = await Tpa.findOne({ _id: id });
  if (!tpa) {
    throw new ApiError(400, "No tpa found!!!");
  }

  const localFilePath = req.files?.logo[0]?.path;
  if (!localFilePath) {
    throw new ApiError(400, "Logo is required!!!");
  }
 const logo = await uploadOnLocalServer(
   imageLocalPath,
   req.files?.logo[0]?.originalname
 );
 if (!logo) throw new ApiError(500, "Failed to upload image");

  // const logo = await uploadOnLocalServer(localFilePath);
  // if (!logo) {
  //   throw new ApiError(500, "Something went wrong while uploading the logo!!!");
  // }

  const updatedTpa = await Tpa.findByIdAndUpdate(
    id,
    { $set: { logo: logo.url } },
    { new: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, "Logo updated successfully!!!", updatedTpa));
});

export {
  createTpa,
  getAllTpas,
  updateTpa,
  getTpa,
  deleteTpa,
  unblockTpa,
  blockTpa,
  updateLogo,
};
