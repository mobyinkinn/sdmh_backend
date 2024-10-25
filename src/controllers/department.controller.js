import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Department } from "../models/department.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createDepartment = asyncHandler(async (req, res) => {
  /**
   * 1. name
   * 2. image
   * 3. bannerImage
   * 4. content
   * 5. status
   *
   *
   * 1. Check if admin is logged in
   * 2. Check if admin has proper rights
   * 3. get department details
   * 4. validation - not empty
   * 5. check for images, check for banner
   * 6. upload them to cloudinary
   * 7. create new department object
   * 8. add to db
   * 9. check for department creation
   * 10. send response
   *
   *
   */

  const { name, content, status } = req.body;

  if (!name || !content || !(status === true || status === false)) {
    throw new ApiError(400, "Please fill the required fileds");
  }

  const existingDepartment = await Department.findOne({ name });

  if (existingDepartment) {
    throw new ApiError(409, "Department already exists");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  const bannerImageLocalPath = req.files?.bannerImage[0].path;

  if (!imageLocalPath || !bannerImageLocalPath) {
    throw new ApiError(400, "Images are required");
  }

  const image = await uploadOnCloudinary(imageLocalPath);
  const bannerImage = await uploadOnCloudinary(bannerImageLocalPath);

  if (!image || !bannerImage) {
    throw new ApiError(500, "Image failed to upload");
  }

  const department = await Department.create({
    name,
    image: image.url,
    bannerImage: bannerImage.url,
    status,
    content,
  });

  const createdDepartment = await Department.findById(department._id);

  if (!createdDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while creating the department"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(200, createdDepartment, "Department created successfully")
    );
});

const updateDepartment = asyncHandler(async (req, res) => {
  const { name, content, status } = req.body;

  if (!name && !content && !(status === true || status === false)) {
    throw new ApiError(400, "All fields are empty");
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    req.query.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedDepartment, "Department updated successfully")
    );
});

const getDepartments = asyncHandler(async (req, res) => {
  const allDepartments = await Department.find({});

  return res
    .status(200)
    .json(
      new ApiResponse(200, allDepartments, "Departments sent successfully")
    );
});

const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const department = await Department.findById(id);

  if (!department) {
    throw new ApiError(400, "No such department exists");
  }

  await Department.deleteOne({ _id: id });

  return res
    .status(200)
    .json(new ApiResponse(200, "Department deleted successfully"));
});

export { createDepartment, getDepartments, updateDepartment, deleteDepartment };
