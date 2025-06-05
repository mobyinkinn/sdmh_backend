import { Checkup } from "../models/checkup.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnLocalServer } from "../utils/cloudinary.js";

const createCheckup = asyncHandler(async (req, res) => {
  const { title, status, description, price, smallDescription } = req.body;
  console.log(req.body);
  if (!title || !description || !price || !smallDescription) {
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
  const image = await uploadOnLocalServer(
    imageLocalPath,
    req.files.image[0]?.originalname
  );
  if (!image) {
    throw new ApiError(500, "Something went wrong while uploading the image");
  }

  const bannerLocalPath = req.files?.banner[0]?.path;
  if (!bannerLocalPath) {
    throw ApiError(400, "Banner is required!!!");
  }
  const banner = await uploadOnLocalServer(
    bannerLocalPath,
    req.files.banner[0]?.originalname
  );

  const images = [];

  if (req.files?.images.length === 0) {
    throw new ApiError(400, "Images are requried");
  }

  for (let i = 0; i < req.files.images.length; i++) {
    const image = await uploadOnLocalServer(
      req.files.images[i].path,
      req.files.images[i]?.originalname
    );
    if (!image) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the images"
      );
    }
    images.push(image.url);
  }

  if (images.length === 0) {
    throw new ApiError(500, "Something went wrong while uploading the images");
  }

  const checkup = await Checkup.create({
    title,
    description,
    status,
    price,
    image: image.url,
    bannerImage: banner.url,
    images: images,
    smallDescription: smallDescription,
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
  const image = await uploadOnLocalServer(
    imageLocalPath,
    req.files.image[0]?.originalname
  );

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
  const banner = await uploadOnLocalServer(
    bannerLocalPath,
    req.files.banner[0]?.originalname
  );

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
  const { title, status, price, description, smallDescription } = req.body;

  const available = await Checkup.findById(req.query.id);
  if (!available) {
    throw new ApiError(400, "Checkup not found!!!");
  }

  if (!title && !description && !price && !smallDescription) {
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

const blockCheckup = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const checkup = await Checkup.findById(id);
  if (!checkup) {
    throw new ApiError(400, "checkup not found!!!");
  }

  // Update the status to false (blocked)
  checkup.status = false;

  const updatedCheckup = await checkup.save();
  if (!updatedCheckup) {
    throw new ApiError(
      500,
      "Something went wrong while blocking the checkup!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "checkup blocked successfully!!!", {
      checkup: updatedCheckup,
    })
  );
});

// Unblock Testimonial function
const unblockCheckup = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const checkup = await Checkup.findById(id);
  if (!checkup) {
    throw new ApiError(400, "checkup not found!!!");
  }

  // Update the status to true (unblocked)
  checkup.status = true;

  const updatedCheckup = await checkup.save();
  if (!updatedCheckup) {
    throw new ApiError(
      500,
      "Something went wrong while unblocking the checkup!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "checkup unblocked successfully!!!", {
      checkup: updatedCheckup,
    })
  );
});

const getCheckupById = asyncHandler(async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    throw new ApiError(400, "Checkup is required!!!");
  }

  const checkup = await Checkup.findOne({ _id });
  if (!checkup) {
    throw new ApiError(400, "No Checkup found");
  }

  res.status(200).json(new ApiResponse(200, "Checkup by id!!!", checkup));
});

const updateImages = asyncHandler(async (req, res) => {
  const healthCheckup = await Checkup.findById(req.query.id);
  if (!healthCheckup) {
    throw new ApiError(400, "No such checkup exists!!!");
  }
  const images = [];

  if (req.files?.images.length === 0) {
    throw new ApiError(400, "Images are requried");
  }

  for (let i = 0; i < req.files.images.length; i++) {
    const image = await uploadOnLocalServer(
      req.files.images[i].path,
      req.files.images[i]?.originalname
    );
    if (!image) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the images"
      );
    }
    images.push(image.url);
  }

  if (images.length === 0) {
    throw new ApiError(500, "Something went wrong while uploading the images");
  }

  const updatedCheckups = await Checkup.findByIdAndUpdate(
    req.query.id,
    { images: images },
    { new: true }
  );

  if (!updatedCheckups) {
    throw new ApiError(
      500,
      "Something went wrong while updating the Checkups!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Checkup images added", updatedCheckups));
});

const deleteImage = asyncHandler(async (req, res) => {
  const checkup = await Checkup.findById(req.query.id);
  const { index } = req.body;

  if (!checkup) {
    throw new ApiError(400, "No checkup found!!!");
  }

  if (!index) {
    throw new ApiError(400, "Index is required!!!");
  }

  const images = checkup.images;
  if (images.length <= 1) {
    throw new ApiError(400, "Images can not be 0, add more images to delete.");
  }

  images.splice(index, 1);
  const updatedImage = await Checkup.findByIdAndUpdate(
    req.query.id,
    { $set: { images } },
    { new: true }
  );

  if (!updatedImage) {
    throw new ApiError(500, "Something went while updating the checkup!!!");
  }

  res.status(200).json(new ApiResponse(200, "Image deleted.", updatedImage));
});

export {
  createCheckup,
  deleteCheckup,
  getAllCheckups,
  updateBanner,
  updateImage,
  updateCheckup,
  blockCheckup,
  unblockCheckup,
  getCheckupById,
  updateImages,
  deleteImage,
};
