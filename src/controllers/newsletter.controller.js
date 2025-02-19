import { Newsletter } from "../models/newsletter.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const existingSubscription = await Newsletter.findOne({ email });
  if (existingSubscription) {
    throw new ApiError(400, "Email is already subscribed");
  }

  const newSubscription = await Newsletter.create({
    email,
  });

  const createdNewsletter = await Newsletter.findById(newSubscription._id);

  res
    .status(200)
    .json(new ApiResponse(200, "Subscribed successfully", createdNewsletter));
});

export const getAllNewsletters = asyncHandler(async (req, res) => {
  const newsletters = await Newsletter.find();

  res
    .status(200)
    .json(new ApiResponse(200, "All newsletter subscriptions", newsletters));
});

export const deleteNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.query;

  if (!email) {
    throw new ApiError(400, "Email is required for deletion");
  }

  const deletedSubscription = await Newsletter.findOneAndDelete({ email });

  if (!deletedSubscription) {
    throw new ApiError(404, "Email not found in subscriptions");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Unsubscribed successfully", deletedSubscription)
    );
});
