import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Metadata } from "../models/seo.model.js"
import { uploadOnLocalServer } from "../utils/cloudinary.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";

const createMetadata = asyncHandler(async (req, res) => {
  const { title, description, keywords, pagename,h1,h2 } = req.body;
  if (!title || !description || !keywords || !pagename || !h1 ||!h2) {
    throw new ApiError(400, "Plese fill all the required fileds!!!");
  }
   const existing = await Metadata.findOne({ pagename });
   if (existing) {
     throw new ApiError(400, "This data has already been exist.");
   }
  const Seo = await Metadata.create({
    title,
    description, 
    keywords,
    pagename,
    h1,
    h2,
  });
  if (!Seo) {
    throw new ApiError(500, "Something went wrong while uploading the blog!!!");
  }
  res.status(200).json(new ApiResponse(200, "MetaData created!!!", Seo));
});

const getMetadata = asyncHandler(async (req, res) => {
  const Seo = await Metadata.find();
  res.status(200).json(new ApiResponse(200, "MetaData found!!!", Seo));
});

const getMetadataByPageName = asyncHandler(async (req, res) => {
  const { pagename } = req.query; // You can also use req.query.pagename if you want to pass it as a query parameter.

  if (!pagename) {
    throw new ApiError(400, "Page name is required!");
  }

  const metadata = await Metadata.findOne({ pagename });

  if (!metadata) {
    throw new ApiError(404, "Metadata not found for the specified page!");
  }

  res.status(200).json(new ApiResponse(200, "Metadata found!", metadata));
});
const deleteMetadataById = asyncHandler(async (req, res) => {
  const { id } = req.query; // You can also use req.body.id if you prefer sending it in the request body.

  // Validate MongoDB ObjectId
  validateMongoDbId(id);

  const metadata = await Metadata.findByIdAndDelete(id);

  if (!metadata) {
    throw new ApiError(404, "Metadata not found for the specified ID!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Metadata deleted successfully!", metadata));
});

const updateMetadataById = asyncHandler(async (req, res) => {
  const { id } = req.query; // You can also use req.body.id if you prefer sending it in the request body.
  const { title, description, keywords, pagename, h1, h2 } = req.body;

  // Validate MongoDB ObjectId
  validateMongoDbId(id);

  if (!title && !description && !keywords && !pagename && !h1 && !h2) {
    throw new ApiError(400, "Please provide at least one field to update!");
  }

  // Find and update the metadata by ID
  const updatedMetadata = await Metadata.findByIdAndUpdate(
    id,
    { title, description, keywords, pagename, h1, h2 },
    { new: true, runValidators: true }
  );

  if (!updatedMetadata) {
    throw new ApiError(404, "Metadata not found for the specified ID!");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Metadata updated successfully!", updatedMetadata)
    );
});



export {
  createMetadata,
  getMetadata,
  getMetadataByPageName,
  deleteMetadataById,
  updateMetadataById,
};
