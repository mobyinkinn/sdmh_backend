import { Teachings } from "../models/teaching.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Department } from "../models/department.model.js";

const createTeaching = asyncHandler(async (req, res) => {
  const { name, year, department, status } = req.body;

  if (!name || !year || !department) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  const fileLocalPath = req.files?.file[0]?.path;
  if (!fileLocalPath) {
    throw new ApiError(400, "Please upload the file!!!");
  }

  const file = await uploadOnCloudinary(fileLocalPath);
  if (!file) {
    throw new ApiError(500, "Failed to upload the file, Please try again!!!");
  }

  const existing = await Teachings.find({ name });
  if (existing.length > 0) {
    throw new ApiError(400, "Entry already exists, please change the name!!!");
  }

  const fetchedDepartment = await Department.findOne({ name: department });
  if (!fetchedDepartment) {
    throw new ApiError(400, "No such department exists!!!");
  }

  const Teaching = await Teachings.create({
    name,
    year,
    department: fetchedDepartment._id,
    status,
    file: file.url,
  });

  if (!Teaching) {
    throw new ApiError(
      400,
      "Something went wrong while creating the teaching!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Teaching, "Teaching created successfully!!!"));
});

const getAllTeachings = asyncHandler(async (req, res) => {
  const teachings = await Teachings.find();

  if (!teachings) {
    throw new ApiError(500, "Something went really wrong!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, teachings, "Teachings sent!!!"));
});

const updateTeachings = asyncHandler(async (req, res) => {
  const { name, year, department, status } = req.body;
  console.log(req.body);

  const isTeachings = await Teachings.findById(req.query.id);
  if (!isTeachings) {
    throw new ApiError(400, "No such teaching exists!!!");
  }

  if (!name && !year && !department && !status) {
    throw new ApiError(400, "At least one field is required to update!!!");
  }

  const filter = {};
  if (name) filter.name = name;
  if (year) filter.year = year;
  if (status) filter.status = status;

  if (department) {
    const fetchedDepartment = await Department.findOne({ name: department });
    if (!fetchedDepartment) {
      throw new ApiError(400, "No such department exists!!!");
    }
    filter.department = fetchedDepartment._id;
  }

  const updatedTeaching = await Teachings.findByIdAndUpdate(
    req.query.id,
    filter,
    {
      new: true,
    }
  );

  if (!updatedTeaching) {
    throw new ApiError(
      500,
      "Something went wrong while updating the teaching!!!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTeaching, "Teaching updated successfully!!!")
    );
});

const deleteTeaching = asyncHandler(async (req, res) => {
  const isTeaching = await Teachings.findById(req.query.id);
  if (!isTeaching) {
    throw new ApiError(400, "No such teaching exists!!!");
  }

  const deleteTeaching = await Teachings.findByIdAndDelete(req.query.id);

  if (!deleteTeaching) {
    throw new ApiError(500, "Something went wrong while deleting Teaching!!!");
  }

  return res.status(200).json(new ApiResponse(200, "Teaching deleted!!!"));
});

const updateFile = asyncHandler(async (req, res) => {
  const id = req.query.id;
  const isTeaching = await Teachings.findById(req.query.id);
  if (!isTeaching) {
    throw new ApiError(400, "No such Teaching exists!!!");
  }

  const fileLocalPath = req.files?.file[0]?.path;
  if (!fileLocalPath) {
    throw new ApiError(400, "File is required!!!");
  }

  const file = await uploadOnCloudinary(fileLocalPath);
  if (!file) {
    throw new ApiError(500, "Failed to upload file!!!");
  }

  const updatedEntry = await Teachings.findByIdAndUpdate(
    id,
    {
      file: file.url,
    },
    { new: true }
  );

  if (!updatedEntry) {
    throw new ApiError(
      500,
      "Something went wroong while updating  teaching file!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "File updated successfully!!!", updatedEntry));
});

const blockTeaching = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const teachings = await Teachings.findById(id);
  if (!teachings) {
    throw new ApiError(400, "Teaching not found!!!");
  }

  // Update the status to false (blocked)
  teachings.status = false;

  const updatedTeaching = await teachings.save();
  if (!updatedTeaching) {
    throw new ApiError(
      500,
      "Something went wrong while blocking the Teachings!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "Teaching blocked successfully!!!", {
      Teaching: updatedTeaching,
    })
  );
});

const unblockTeaching = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const teachings = await Teachings.findById(id);
  if (!teachings) {
    throw new ApiError(400, "Teaching not found!!!");
  }

  // Update the status to true (unblocked)
  teachings.status = true;

  const updatedTeaching = await teachings.save();
  if (!updatedTeaching) {
    throw new ApiError(
      500,
      "Something went wrong while unblocking the teaching!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "teaching unblocked successfully!!!", {
      teaching: updatedTeaching,
    })
  );
});
export {
  createTeaching,
  getAllTeachings,
  updateTeachings,
  deleteTeaching,
  updateFile,
  blockTeaching,
  unblockTeaching,
};
