import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Navbar } from "../models/navbar.model.js";

const createNavbar = asyncHandler(async (req, res) => {
  const { orderId, name, link } = req.body;

  if (!orderId || !name || !link) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const navbar = await Navbar.create(req.body);
  if (!navbar) {
    throw new ApiError(500, "Something went wrong while creating the navbar");
  }

  res.status(200).json(new ApiResponse(200, "Navbar created", navbar));
});

const getAllNavbars = asyncHandler(async (req, res) => {
  const navbars = await Navbar.find();

  if (!navbars) {
    throw new ApiError(500, "Something went wrong fetching the navbars");
  }

  res.status(200).json(new ApiResponse(200, "Navbars sent", navbars));
});

const updateNavbar = asyncHandler(async (req, res) => {
  const { orderId, name, link } = req.body;
  if (!name && !link && !orderId) {
    throw new ApiError(400, "All fields are empty!!!");
  }

  const navbar = await Navbar.findById(req.query.id);
  if (!navbar) {
    throw new ApiError(400, "Navbar not found!!!");
  }

  const updatedNavbar = await Navbar.findByIdAndUpdate(
    req.query.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!updatedNavbar) {
    throw new ApiError(
      500,
      "Something went wrong while updating the navbar!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Navbar updated successfully", updatedNavbar));
});

const deleteNavbar = asyncHandler(async (req, res) => {
  const navbar = await Navbar.findById(req.query.id);
  if (!navbar) {
    throw new ApiError(400, "No navbar found!!!");
  }

  const deletedNavbar = await Navbar.findByIdAndDelete(req.query.id);
  if (!deletedNavbar) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the navbar!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Navbar deleted successfully"));
});

export { getAllNavbars, createNavbar, updateNavbar, deleteNavbar };
