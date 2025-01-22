import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Pages } from "../models/pages.model.js";

const createPage = asyncHandler(async (req, res) => {
  const { name, status } = req.body;
  if (!name) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const exsisting = await Pages.find({ name });
  if (exsisting.length > 1) {
    throw new ApiError(400, "Entry already exists, please change the name!!!");
  }

  const page = await Pages.create({
    name,
    status,
  });

  if (!page) {
    throw new ApiError(400, "Something went wrong while creating the page!!!");
  }

  return res.status(200).json(new ApiResponse(200, page, "Pages created!!!"));
});

const getAllPages = asyncHandler(async (req, res) => {
  const pages = await Pages.find();

  if (!pages) {
    throw new ApiError(500, "Something went really wrong!!!");
  }

  return res.status(200).json(new ApiResponse(200, pages, "Pages sent!!!"));
});

const updatePage = asyncHandler(async (req, res) => {
  const { name, status } = req.body;

  const isPages = await Pages.findById(req.query.id);
  if (!isPages) {
    throw new ApiError(400, "No such page exists!!!");
  }

  if (!name && !status) {
    throw new ApiError(400, "All fields are empty");
  }

  const filter = {};
  if (name) filter.name = name;
  if (status) filter.status = status;

  const updatedPage = await Pages.findByIdAndUpdate(req.query.id, filter, {
    new: true,
  });

  if (!updatedPage) {
    throw new ApiError(500, "Something went wrong while updating Page!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedPage, "Page updated!!!"));
});

const deletePage = asyncHandler(async (req, res) => {
  const isPage = await Pages.findById(req.query.id);
  if (!isPage) {
    throw new ApiError(400, "No such Page exists!!!");
  }

  const deletedPage = await Pages.findByIdAndDelete(req.query.id);

  if (!deletedPage) {
    throw new ApiError(500, "Something went wrong while deleting Page!!!");
  }

  return res.status(200).json(new ApiResponse(200, "Page deleted!!!"));
});

export { createPage, getAllPages, updatePage, deletePage };
