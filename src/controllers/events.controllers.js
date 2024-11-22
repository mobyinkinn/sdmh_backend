import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Events } from "../models/events.model.js";

const createEvents = asyncHandler(async (req, res) => {
  const { title, smallDescription, description, date, status, featured } =
    req.body;
  if (!title || !smallDescription || !description || !date || !featured) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const existingEvent = await Events.findOne({ title });
  if (existingEvent) {
    throw new ApiError(400, "Event already exists");
  }

  const images = [];

  if (req.files?.images.length === 0) {
    throw new ApiError(400, "Images are requried");
  }

  for (let i = 0; i < req.files.images.length; i++) {
    const image = await uploadOnCloudinary(req.files.images[i].path);
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

  const event = await Events.create({
    title,
    smallDescription,
    description,
    featured,
    date,
    status: status || true,
    images: images,
  });

  if (!event) {
    throw new ApiError(500, "Something went wrong while creating the event!!!");
  }

  res.status(200).json(new ApiResponse(200, "Tpa created", event));
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Events.find();
  if (!events || events.length === 0) {
    throw new ApiError(500, "Something went wrong while fetching the Events");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Events fetched successfully", events));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { title, smallDescription, description, date, status, featured } =
    req.body;

  if (
    !title &&
    !smallDescription &&
    !description &&
    !date &&
    !featured &&
    !status
  ) {
    throw new ApiError(400, "All fields are empty");
  }

  const exists = await Events.findById(req.query.id);
  if (!exists) {
    throw new ApiError(400, "No event found");
  }

  const updatedEvent = await Events.findByIdAndUpdate(
    req.query.id,
    { $set: req.body },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(500, "Something went wrong while updating the event!!!");
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Event updated succesfully", updatedEvent));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const exists = await Events.findById(req.query.id);
  if (!exists) {
    throw new ApiError(400, "No event found");
  }

  const deletedEvent = await Events.findByIdAndDelete(req.query.id);

  if (!deletedEvent) {
    throw new ApiError(500, "Something went wrong while deleting the event");
  }

  res.status(200).json(new ApiResponse(200, "Event deleted successfully"));
});

const deleteImage = asyncHandler(async (req, res) => {
  const event = await Events.findById(req.query.id);
  const { index } = req.body;

  if (!event) {
    throw new ApiError(400, "No event found!!!");
  }

  if (!index) {
    throw new ApiError(400, "Index is required!!!");
  }

  const images = event.images;
  if (images.length <= 1) {
    throw new ApiError(400, "Images can not be 0, add more images to delete.");
  }

  images.splice(index, 1);
  const updatedEvent = await Events.findByIdAndUpdate(
    req.query.id,
    { $set: { images } },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(500, "Something went while updating the event!!!");
  }

  res.status(200).json(new ApiResponse(200, "Image deleted.", updatedEvent));
});

const addImages = asyncHandler(async (req, res) => {
  const event = await Events.findById(req.query.id);
  if (!event) {
    throw new ApiError(400, "No event found!!!");
  }

  console.log(req.files);

  const existingImages = event.images.length;
  const incomingImages = req.files.images.length;

  if (existingImages + incomingImages > 6) {
    throw new ApiError(
      400,
      `Only ${6 - existingImages} images can be added, remove the extra images`
    );
  }
  if (incomingImages.length === 0) {
    throw new ApiError(400, "Please add images.!!!");
  }

  const images = event.images;

  for (let i = 0; i < incomingImages; i++) {
    const image = await uploadOnCloudinary(req.files.images[i].path);
    if (!image) {
      throw new ApiError(
        500,
        "Something went wrong while uploading the images"
      );
    }
    images.push(image.url);
  }

  const updatedEvent = await Events.findByIdAndUpdate(
    req.query.id,
    { $set: { images } },
    { new: true }
  );

  res.status(200).json(new ApiResponse(200, "Images added.", updatedEvent));
});

export {
  createEvents,
  updateEvent,
  deleteEvent,
  getAllEvents,
  deleteImage,
  addImages,
};
