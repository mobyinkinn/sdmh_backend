import { Notices } from "../models/notice.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Department } from "../models/department.model.js";

const createNotice = asyncHandler(async (req, res) => {
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

  const existing = await Notices.find({ name });
  if (existing.length > 0) {
    throw new ApiError(400, "Entry already exists, please change the name!!!");
  }

  const fetchedDepartment = await Department.findOne({ name: department });
  if (!fetchedDepartment) {
    throw new ApiError(400, "No such department exists!!!");
  }

  const Notice = await Notices.create({
    name,
    year,
    department: fetchedDepartment._id,
    status,
    file: file.url,
  });

  if (!Notice) {
    throw new ApiError(
      400,
      "Something went wrong while creating the notice!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Notice, "Notice created successfully!!!"));
});

const getAllNotices = asyncHandler(async (req, res) => {
  const notices = await Notices.find();

  if (!notices) {
    throw new ApiError(500, "Something went really wrong!!!");
  }

  return res.status(200).json(new ApiResponse(200, notices, "Notices sent!!!"));
});

const updateNotices = asyncHandler(async (req, res) => {
  const { name, year, department, status } = req.body;

  const isNotices = await Notices.findById(req.query.id);
  if (!isNotices) {
    throw new ApiError(400, "No such notice exists!!!");
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

  const updatedNotice = await Notices.findByIdAndUpdate(req.query.id, filter, {
    new: true,
  });

  if (!updatedNotice) {
    throw new ApiError(
      500,
      "Something went wrong while updating the notice!!!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedNotice, "Notice updated successfully!!!")
    );
});

const deleteNotice = asyncHandler(async (req, res) => {
  const isNotice = await Notices.findById(req.query.id);
  if (!isNotice) {
    throw new ApiError(400, "No such notice exists!!!");
  }

  const deleteNotice = await Notices.findByIdAndDelete(req.query.id);

  if (!deleteNotice) {
    throw new ApiError(500, "Something went wrong while deleting Notice!!!");
  }

  return res.status(200).json(new ApiResponse(200, "Notice deleted!!!"));
});

const updateFile = asyncHandler(async (req, res) => {
  const id = req.query.id;
  const isNotice = await Notices.findById(req.query.id);
  if (!isNotice) {
    throw new ApiError(400, "No such Notice exists!!!");
  }

  const fileLocalPath = req.files?.file[0]?.path;
  if (!fileLocalPath) {
    throw new ApiError(400, "File is required!!!");
  }

  const file = await uploadOnCloudinary(fileLocalPath);
  if (!file) {
    throw new ApiError(500, "Failed to upload file!!!");
  }

  const updatedEntry = await Notices.findByIdAndUpdate(
    id,
    {
      file: file.url,
    },
    { new: true }
  );

  if (!updatedEntry) {
    throw new ApiError(
      500,
      "Something went wroong while updating downloadables!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "File updated successfully!!!", updatedEntry));
});

const blockNotice = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const notices = await Notices.findById(id);
  if (!notices) {
    throw new ApiError(400, "Notice not found!!!");
  }

  // Update the status to false (blocked)
  notices.status = false;

  const updatedNotice = await notices.save();
  if (!updatedNotice) {
    throw new ApiError(
      500,
      "Something went wrong while blocking the Notices!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "Notice blocked successfully!!!", {
      Notice: updatedNotice,
    })
  );
});

const unblockNotice = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const notices = await Notices.findById(id);
  if (!notices) {
    throw new ApiError(400, "Notice not found!!!");
  }

  // Update the status to true (unblocked)
  notices.status = true;

  const updatedNotice = await notices.save();
  if (!updatedNotice) {
    throw new ApiError(
      500,
      "Something went wrong while unblocking the blog!!!"
    );
  }

  res.status(200).json(
    new ApiResponse(200, "blog unblocked successfully!!!", {
      notice: updatedNotice,
    })
  );
});
export {
  createNotice,
  getAllNotices,
  updateNotices,
  deleteNotice,
  updateFile,
  blockNotice,
  unblockNotice,
};
