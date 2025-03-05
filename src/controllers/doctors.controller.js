import { Doctor } from "../models/doctors.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import csv from "csv-parser";
import fs from "fs";

const createDoctor = asyncHandler(async (req, res) => {
  const {
    order,
    name,
    department,
    designation,
    floor,
    room,
    about,
    status,
    availablity,
  } = req.body;

  if (
    !order ||
    !name ||
    !department ||
    !designation ||
    !availablity ||
    !about ||
    !status
  ) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  // Convert availablity from string to object
  let parsedAvailablity;
  if (availablity) {
    try {
      parsedAvailablity =
        typeof availablity === "string" ? JSON.parse(availablity) : availablity;

      if (
        typeof parsedAvailablity !== "object" ||
        Array.isArray(parsedAvailablity)
      ) {
        throw new Error();
      }
    } catch (error) {
      throw new ApiError(
        400,
        "Availability must be a valid JSON object with key-value pairs!!!"
      );
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

  const doctor = await Doctor.create({
    order,
    name,
    image: image.url,
    department,
    designation,
    availablity: parsedAvailablity,
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
    order,
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
    !order &&
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

  // Convert availablity from string to object if provided
  let parsedAvailablity;
  if (availablity) {
    try {
      parsedAvailablity =
        typeof availablity === "string" ? JSON.parse(availablity) : availablity;

      if (
        typeof parsedAvailablity !== "object" ||
        Array.isArray(parsedAvailablity)
      ) {
        throw new Error();
      }
    } catch (error) {
      throw new ApiError(
        400,
        "Availability must be a valid JSON object with key-value pairs!!!"
      );
    }
  }

  const updateFields = {};
  if (order) updateFields.order = order;
  if (name) updateFields.name = name;
  if (department) updateFields.department = department;
  if (designation) updateFields.designation = designation;
  if (parsedAvailablity) updateFields.availablity = parsedAvailablity;
  if (floor) updateFields.floor = floor;
  if (room) updateFields.room = room;
  if (about) updateFields.about = about;
  if (status !== undefined) updateFields.status = status;

  const updatedDoctor = await Doctor.findByIdAndUpdate(
    req.query.id,
    {
      $set: updateFields,
    },
    { new: true }
  );

  if (!updatedDoctor) {
    throw new ApiError(500, "Something went wrong while updating doctor");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedDoctor, "Doctor Updated Successfully"));
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
  const allDoctors = await Doctor.find().sort({ order: 1 });

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

const getDoctorByName = asyncHandler(async (req, res) => {
  if (!req.query.id) {
    throw new ApiError(400, "Please provide the required name!!!");
  }

  const doctor = await Doctor.find({ department: req.query.id });

  if (!doctor) {
    throw new ApiError(400, "No Doctor found with the given name!!!");
  }

  res.status(200).json(new ApiResponse(200, "Doctor found", doctor));
});

const getDoctorByID = asyncHandler(async (req, res) => {
  if (!req.query.id) {
    throw new ApiError(400, "Please provide the required name!!!");
  }

  const doctor = await Doctor.findOne({ _id: req.query.id });

  if (!doctor) {
    throw new ApiError(400, "No Doctor found with the given name!!!");
  }

  res.status(200).json(new ApiResponse(200, "Doctor found", doctor));
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

const updateDoctorsOrder = asyncHandler(async (req, res) => {
  console.log(req.body);
  const updatedOrder = req.body;

  try {
    // Loop through the updated order array and update each doctor's order in the database
    for (const doctor of updatedOrder) {
      await Doctor.findByIdAndUpdate(doctor.id, { order: doctor.order });
    }

    res.status(200).json({
      status: "success",
      message: "Doctors order updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "An error occurred while updating doctors order.",
    });
  }
});

const importDoctors = asyncHandler(async (req, res) => {
  const csvLocalPath = req.files?.csv[0]?.path;

  if (!csvLocalPath) {
    throw new ApiError(400, "Upload the file");
  }

  const fields = [
    "name",
    "department",
    "designation",
    "availablity",
    "about",
    "floor",
    "room",
    "status",
    "order",
  ];
  const errors = [];
  const results = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvLocalPath)
        .pipe(csv())
        .on("data", (row) => {
          // Ensure missing fields are replaced with defaults
          fields.forEach((field) => {
            if (!(field in row)) {
              row[field] =
                field === "order" ? -1 : field === "status" ? true : "";
            }
          });

          // Convert availablity from string to object
          let parsedAvailablity;
          if (row.availablity) {
            try {
              parsedAvailablity =
                typeof row.availablity === "string"
                  ? JSON.parse(row.availablity)
                  : row.availablity;

              if (
                typeof parsedAvailablity !== "object" ||
                Array.isArray(parsedAvailablity)
              ) {
                throw new Error();
              }
            } catch (error) {
              throw new ApiError(
                400,
                "Availability must be a valid JSON object with key-value pairs!!!"
              );
            }
          }
          row.availablity = parsedAvailablity;

          results.push(row);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const savedEntries = [];
    for (const entry of results) {
      const doctor = await Doctor.create(entry);
      savedEntries.push(doctor);
    }

    fs.unlinkSync(csvLocalPath);

    res.status(200).json({
      message: "Doctors imported successfully",
      data: savedEntries,
    });
  } catch (error) {
    fs.unlinkSync(csvLocalPath);
    return res.status(500).json({ message: "Error processing CSV", error });
  }
});

export {
  createDoctor,
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getDoctor,
  updateImage,
  getDoctorByName,
  getDoctorByID,
  updateDoctorsOrder,
  importDoctors,
};
