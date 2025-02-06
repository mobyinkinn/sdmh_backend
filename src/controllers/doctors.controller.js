import { Doctor } from "../models/doctors.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Department } from "../models/department.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createDoctor = asyncHandler(async (req, res) => {
  const { name, department, designation, floor, room, about, status } =
    req.body;

  const availability = JSON.parse(req.body.availability);

  if (
    !name ||
    !department ||
    !designation ||
    !availability ||
    typeof availability !== "object" ||
    !about ||
    !status
  ) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  // Validate availability structure
  for (const day in availability) {
    if (
      typeof availability[day] !== "object" ||
      typeof availability[day].OT !== "boolean" ||
      typeof availability[day].OPD !== "boolean"
    ) {
      throw new ApiError(400, `Invalid availability format for ${day}`);
    }
  }

  const imageLocalPath = req.files?.image?.[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  if (!image) {
    throw new ApiError(500, "Image failed to upload!!!");
  }

  const fetchedDepartment = await Department.findOne({ name: department });
  if (!fetchedDepartment) {
    throw new ApiError(400, "No such department exists!!!");
  }

  const doctor = await Doctor.create({
    name,
    image: image.url,
    department: fetchedDepartment._id,
    designation,
    availability,
    floor: floor ?? undefined,
    room: room ?? undefined,
    about,
    status,
  });

  if (!doctor) {
    throw new ApiError(500, "Something went wrong while creating the doctor");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, doctor, "Doctor created successfully!!!"));
});

const updateDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    department,
    designation,
    availablity,
    floor,
    room,
    about,
    status,
  } = req.body;

  if (
    !name &&
    !department &&
    !designation &&
    !availablity &&
    !floor &&
    !room &&
    !about &&
    !(status === true || status === false)
  ) {
    throw new ApiError(400, "All fields are empty");
  }

  const doctor = await Doctor.findById(req.query.id);
  if (!doctor) {
    throw new ApiError(400, "No such doctor exists!!!");
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.query.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!updatedDoctor) {
    throw new ApiError(500, "Something went wrong while updating doctor");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Doctor Updated Successfully", updatedDoctor));
});

const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.query.id);
  if (!doctor) {
    throw new ApiError(400, "No such doctor exists!!!");
  }

  const deletedDoctor = await Doctor.findByIdAndDelete(req.query.id, {
    new: true,
  });

  if (!deletedDoctor) {
    throw new ApiError(500, "Something went wrong while deleting doctor");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Doctor Deleted Successfully"));
});

const getAllDoctors = asyncHandler(async (req, res) => {
  const allDoctors = await Doctor.find();

  if (!allDoctors) {
    throw new ApiError(
      500,
      "Something went wrong while fetching the doctors!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, allDoctors, "Doctors sent successfully!!!"));
});

const getDoctor = asyncHandler(async (req, res) => {
  const { id, name, department } = req.body;

  if (!id && !name && !department) {
    throw new ApiError(400, "All fields are empty");
  }

  const filter = {};
  if (id) filter._id = id;
  if (name) filter.name = name;
  if (department) filter.department = department;

  const doctors = await Doctor.find(filter);

  if (doctors.length === 0) {
    throw new ApiError(400, "No doctor found!!!");
  }

  return res.status(200).json(new ApiResponse(200, "Doctor found", doctors));
});

const updateImage = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.query.id);
  if (!doctor) {
    throw new ApiError(400, "No such doctor exists!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;

  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);

  if (!image) {
    throw new ApiError(500, "Image failed to upload");
  }

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.query.id,
    { image: image.url },
    { new: true }
  );

  if (!updatedDoctor) {
    throw new ApiError(
      500,
      "Something went wrong while updating the doctor!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Doctor found", updatedDoctor));
});

export {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctor,
  updateImage,
};
