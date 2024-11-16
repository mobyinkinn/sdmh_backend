import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Events } from "../models/events.model.js";
const createEvents = asyncHandler(async (req, res) => {
  const { title, SmallDescription, Description, Date } = req.body;
console.log("rew",req.body)
  if (!title || !SmallDescription || !Description || !Date) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const existingEvent = await Events.findOne({ title });
  if (existingEvent) {
    throw new ApiError(400, "Event already exists");
  }

  console.log(req.files);
  const imageLocalPath = req.files?.image[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "images is required");
  }
  const image = await uploadOnCloudinary(imageLocalPath);
  console.log("imageLocalPath", image);

  if (!image) {
    throw new ApiError(500, "Something went wrong while uploading the logo");
  }

  const events = await Events.create({
    title,
    SmallDescription,
    Description,
    Date,
    image: image.url,
  });

  const createdTpa = await Events.findById(events._id);

  res.status(200).json(new ApiResponse(200, "Tpa created", createdTpa));
});

export { createEvents };