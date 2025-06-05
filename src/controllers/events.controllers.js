import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnLocalServer } from "../utils/cloudinary.js";
import { Events } from "../models/events.model.js";

// const createEvents = asyncHandler(async (req, res) => {
//   const { title, smallDescription, description, date, status, featured, tag } =
//     req.body;
//   if (
//     !title ||
//     !smallDescription ||
//     !description ||
//     !date ||
//     !featured ||
//     !tag
//   ) {
//     throw new ApiError(400, "Please fill the required fields!!!");
//   }

//   const existingEvent = await Events.findOne({ title });
//   if (existingEvent) {
//     throw new ApiError(400, "Event already exists");
//   }

//   const imageLocalPath = req.files?.image[0]?.path;
//   if (!imageLocalPath) {
//     throw new ApiError(400, "Image is required!!!");
//   }

//   const image = await uploadOnLocalServer(imageLocalPath);
//   if (!image) {
//     throw new ApiError(500, "Image failed to upload!!!");
//   }

//   const images = [];

//   if (req.files?.images.length === 0) {
//     throw new ApiError(400, "Images are requried");
//   }

//   for (let i = 0; i < req.files.images.length; i++) {
//     const image = await uploadOnLocalServer(req.files.images[i].path);
//     if (!image) {
//       throw new ApiError(
//         500,
//         "Something went wrong while uploading the images"
//       );
//     }
//     images.push(image.url);
//   }

//   if (images.length === 0) {
//     throw new ApiError(500, "Something went wrong while uploading the images");
//   }

//   const event = await Events.create({
//     title,
//     tag,
//     smallDescription,
//     description,
//     featured,
//     date,
//     status: status || true,
//     images: images,
//     image: image.url || undefined,
//   });

//   if (!event) {
//     throw new ApiError(500, "Something went wrong while creating the event!!!");
//   }

//   res.status(200).json(new ApiResponse(200, "Event created", event));
// });

const createEvents = asyncHandler(async (req, res) => {
  const { title, smallDescription, description, date, status, featured, tag } =
    req.body;

  // Validation: required fields
  if (
    !title ||
    !smallDescription ||
    !description ||
    !date ||
    !featured ||
    !tag
  ) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  // Check if event already exists
  const existingEvent = await Events.findOne({ title });
  if (existingEvent) {
    throw new ApiError(400, "Event already exists");
  }

  // Validate main image
  const imageLocalPath = req.files?.image?.[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Main image is required!!!");
  }

  // Upload main image
  const image = await uploadOnLocalServer(
    imageLocalPath,
    req.files.image[0]?.originalname
  );
  if (!image) {
    throw new ApiError(500, "Main image failed to upload!!!");
  }

  if (!req.files?.images || req.files.images.length === 0) {
    throw new ApiError(400, "Additional images are required");
  }
  const images = [];
   if (!req.files?.images || req.files.images.length === 0) {
     throw new ApiError(400, "Images are required");
   }
  for (let i = 0; i < req.files.images.length; i++) {
    const imgUpload = await uploadOnLocalServer(
      req.files.images[i].path,
      req.files.images[i]?.originalname
    );
    if (!imgUpload) {
      throw new ApiError(
        500,
        "Something went wrong while uploading additional images"
      );
    }
    images.push(imgUpload.url);
  }

  if (images.length === 0) {
    throw new ApiError(500, "No additional images were uploaded");
  }

  // Create the event document
  const event = await Events.create({
    title,
    tag,
    smallDescription,
    description,
    featured,
    date,
    status: status !== undefined ? status : true, // default true if not provided
    image: image.url,
    images: images,
  });

  if (!event) {
    throw new ApiError(500, "Something went wrong while creating the event!!!");
  }

  // Return success response
  res.status(200).json(new ApiResponse(200, "Event created", event));
});

const getAllEvents = asyncHandler(async (req, res) => {
  const events = await Events.find();
  // if (!events || events.length === 0) {
  //   throw new ApiError(500, "Something went wrong while fetching the Events");
  // }

  res
    .status(200)
    .json(new ApiResponse(200, "Events fetched successfully", events));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { title, smallDescription, description, date, status, featured, tag } =
    req.body;

  if (
    !title &&
    !tag &&
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

  const existingImages = event.images?.length;

  if (!req.files) {
    throw new ApiError(400, "No images found to add!!!");
  }
  const incomingImages = req.files.images?.length;

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
    const image = await uploadOnLocalServer(req.files.images[i].path);
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

const updateImage = asyncHandler(async (req, res) => {
  const event = await Events.findById(req.query.id);
  if (!event) {
    throw new ApiError(400, "No such event exists!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const image = await uploadOnLocalServer(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload");
  }

  const updatedEvent = await Events.findByIdAndUpdate(
    req.query.id,
    { image: image.url },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(
      500,
      "Something went wrong while updating the events!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Event found", updatedEvent));
});

const getEventById = asyncHandler(async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    throw new ApiError(400, "Event is required!!!");
  }

  const event = await Events.findOne({ _id });
  if (!event) {
    throw new ApiError(400, "No Event found");
  }

  res.status(200).json(new ApiResponse(200, "Event by id!!!", event));
});

export {
  createEvents,
  updateEvent,
  deleteEvent,
  getAllEvents,
  deleteImage,
  addImages,
  updateImage,
  getEventById,
};
