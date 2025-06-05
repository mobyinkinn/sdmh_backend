import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Department } from "../models/department.model.js";
import { uploadOnLocalServer } from "../utils/cloudinary.js";
import csv from "csv-parser";
import fs from "fs";

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
console.log("re",req.body)
  if (!name || !content || !status) {
    throw new ApiError(400, "Please fill the required fields");
  }

  const existingDepartment = await Department.findOne({ name });

  if (existingDepartment) {
    throw new ApiError(409, "Department already exists");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  const bannerImageLocalPath = req.files?.bannerImage[0].path;
  const homeImageLocalPath = req.files?.homeImage[0].path;
  const mobileBannerImageLocalPath = req.files?.mobileBanner[0].path;

  if (
    !imageLocalPath ||
    !bannerImageLocalPath ||
    !mobileBannerImageLocalPath ||
    !homeImageLocalPath
  ) {
    throw new ApiError(400, "Images are required");
  }

 const image = await uploadOnLocalServer(
   imageLocalPath,
   req.files?.image[0]?.originalname
 );
 if (!image) throw new ApiError(500, "Failed to upload image");

 const bannerImage = await uploadOnLocalServer(
   bannerImageLocalPath,
   req.files?.bannerImage[0]?.originalname
 );
 if (!bannerImage) throw new ApiError(500, "Failed to upload banner image");

 const homeImage = await uploadOnLocalServer(
   homeImageLocalPath,
   req.files?.homeImage[0]?.originalname
 );
 if (!homeImage) throw new ApiError(500, "Failed to upload home image");

 const mobileBanner = await uploadOnLocalServer(
   mobileBannerImageLocalPath,
   req.files?.mobileBanner[0]?.originalname
 );
 if (!mobileBanner) throw new ApiError(500, "Failed to upload mobile banner");

  // if (!image || !bannerImage || !mobileBanner || !homeImage) {
  //   throw new ApiError(500, "Image failed to upload");
  // }

  const department = await Department.create({
    name,
    image: image.url,
    bannerImage: bannerImage.url,
    mobileBanner: mobileBanner.url,
    homeImage: homeImage.url,
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
const getDepartmentByName = asyncHandler(async (req, res) => {
  if (!req.query.id) {
    throw new ApiError(400, "Please provide the required name!!!");
  }

  const department = await Department.findOne({ _id: req.query.id });

  if (!department) {
    throw new ApiError(400, "No Department found with the given name!!!");
  }

  res.status(200).json(new ApiResponse(200, "Department found", department));
});

// const getDepartmentById = asyncHandler(async (req, res) => {
//   if (!req.query.id) {
//     throw new ApiError(400, "Please provide the required id!!!");
//   }
//   const opening = await Department.findById(req.query.id);

//   if (!opening) {
//     throw new ApiError(400, "No Opening found!!!");
//   }

//   res.status(200).json(new ApiResponse(200, "Opening found", opening));
// });
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

const getAllDepartments = asyncHandler(async (req, res) => {
  const allDepartments = await Department.find({});

  return res
    .status(200)
    .json(
      new ApiResponse(200, allDepartments, "Departments sent successfully")
    );
});

const getDepartment = asyncHandler(async (req, res) => {
  const { id, name } = req.body;

  if (!id && !name) {
    throw new ApiError(400, "All fields are empty");
  }

  const filter = {};
  if (id) filter._id = id;
  if (name) filter.name = name;

  const departments = await Department.find(filter);

  if (departments.length === 0) {
    throw new ApiError(400, "No department found!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Department found", departments));
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

const updateImage = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new ApiError(400, "Id is required!!!");
  }

  const department = await Department.findOne({ _id: id });
  if (!department) {
    throw new ApiError(400, "No department found!!!");
  }

  const imageLocalPath = req.files?.image[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnLocalServer(
    imageLocalPath,
    req.files.image[0]?.originalname
  );
  if (!image) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the image!!!"
    );
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: { image: image.url },
    },
    { new: true }
  );

  if (!updatedDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while updating the database!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Image updated!!!", updatedDepartment));
});

const updateHomeImage = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new ApiError(400, "Id is required!!!");
  }

  const department = await Department.findOne({ _id: id });
  if (!department) {
    throw new ApiError(400, "No department found!!!");
  }

  const homeImageLocalPath = req.files?.homeImage[0]?.path;
  if (!homeImageLocalPath) {
    throw new ApiError(400, "Home Image is required!!!");
  }

  const homeImage = await uploadOnLocalServer(
    homeImageLocalPath,
    req.files.homeImage[0]?.originalname
  );
  if (!homeImage) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the homeImage!!!"
    );
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: { homeImage: homeImage.url },
    },
    { new: true }
  );

  if (!updatedDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while updating the database!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Home Image updated!!!", updatedDepartment));
});

const updateBanner = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new ApiError(400, "Id is required!!!");
  }

  const department = await Department.findOne({ _id: id });
  if (!department) {
    throw new ApiError(400, "No department found!!!");
  }

  const imageLocalPath = req.files?.banner[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Image is required!!!");
  }

  const image = await uploadOnLocalServer(
    imageLocalPath,
    req.files.banner[0]?.originalname
  );
  if (!image) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the image!!!"
    );
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: { bannerImage: image.url },
    },
    { new: true }
  );

  if (!updatedDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while updating the database!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Image updated!!!", updatedDepartment));
});

const updateMobileBanner = asyncHandler(async (req, res) => {
  const { id } = req.query;
  if (!id) {
    throw new ApiError(400, "Id is required!!!");
  }

  const department = await Department.findOne({ _id: id });
  if (!department) {
    throw new ApiError(400, "No department found!!!");
  }

  const imageLocalPath = req.files?.mobileBanner[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "MobileBanner is required!!!");
  }

  const image = await uploadOnLocalServer(
    imageLocalPath,
    req.files.mobileBanner[0]?.originalname
  );
  if (!image) {
    throw new ApiError(
      500,
      "Something went wrong while uploading the image!!!"
    );
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: { mobileBanner: image.url },
    },
    { new: true }
  );

  if (!updatedDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while updating the database!!!"
    );
  }

  res
    .status(200)
    .json(new ApiResponse(200, "Image updated!!!", updatedDepartment));
});

const importDepartments = asyncHandler(async (req, res) => {
  const csvLocalPath = req.files?.csv[0]?.path;

  if (!csvLocalPath) {
    throw new ApiError(400, "Upload the file");
  }

  const requiredFields = ["name", "content"];
  const booleanFields = ["status"];
  const errors = [];
  const results = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvLocalPath)
        .pipe(csv())
        .on("data", (row) => {
          const missingFields = requiredFields.filter((field) => !row[field]);

          if (missingFields.length > 0) {
            errors.push({
              row,
              error: `Missing fields: ${missingFields.join(", ")}`,
            });
            return;
          }

          // Default status to true if not provided
          row["status"] =
            row["status"] !== undefined
              ? row["status"].toLowerCase() === "true"
              : true;

          results.push(row);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const savedEntries = [];
    for (const entry of results) {
      const department = await Department.create(entry);
      savedEntries.push(department);
    }

    fs.unlinkSync(csvLocalPath);

    if (errors.length > 0) {
      return res.status(400).json({
        message: "Some required fields are missing",
        errors,
      });
    }

    res.status(200).json({
      message: "Departments imported successfully",
      data: savedEntries,
    });
  } catch (error) {
    fs.unlinkSync(csvLocalPath); // Clean up uploaded file
    return res.status(500).json({ message: "Error processing CSV", error });
  }
});

const deleteBanner = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new ApiError(400, "Department ID is required!!!");
  }

  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(404, "Department not found!!!");
  }

  if (!department.bannerImage) {
    throw new ApiError(400, "No banner image exists for this department!!!");
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: { bannerImage: null },
    },
    { new: true }
  );

  if (!updatedDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while removing the banner!!!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedDepartment, "Banner removed successfully")
    );
});

const deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new ApiError(400, "Department ID is required!!!");
  }

  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(404, "Department not found!!!");
  }

  if (!department.image) {
    throw new ApiError(400, "No image exists for this department!!!");
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: { image: null },
    },
    { new: true }
  );

  if (!updatedDepartment) {
    throw new ApiError(500, "Something went wrong while removing the image!!!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedDepartment, "Image removed successfully")
    );
});

const deleteMobileBanner = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new ApiError(400, "Department ID is required!!!");
  }

  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(404, "Department not found!!!");
  }

  if (!department.mobileBanner) {
    throw new ApiError(400, "No mobile banner exists for this department!!!");
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: { mobileBanner: null },
    },
    { new: true }
  );

  if (!updatedDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while removing the mobile banner!!!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedDepartment,
        "Mobile banner removed successfully"
      )
    );
});

const deleteHomeImage = asyncHandler(async (req, res) => {
  const { id } = req.query;

  if (!id) {
    throw new ApiError(400, "Department ID is required!!!");
  }

  const department = await Department.findById(id);
  if (!department) {
    throw new ApiError(404, "Department not found!!!");
  }

  if (!department.homeImage) {
    throw new ApiError(400, "No home image exists for this department!!!");
  }

  const updatedDepartment = await Department.findByIdAndUpdate(
    id,
    {
      $set: { homeImage: null },
    },
    { new: true }
  );

  if (!updatedDepartment) {
    throw new ApiError(
      500,
      "Something went wrong while removing the home image!!!"
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedDepartment, "Home image removed successfully")
    );
});



const setDefaultDepartmentByIndex = asyncHandler(async (req, res) => {
  const { index } = req.query;

  if (index === undefined || isNaN(index)) {
    throw new ApiError(400, "Please provide a valid index");
  }

  const departments = await Department.find().sort({ createdAt: 1 }); // Ensure consistent order
  const target = departments[parseInt(index)];

  if (!target) {
    throw new ApiError(404, "No department found at this index");
  }

  // Reset previous defaults
  await Department.updateMany({}, { $set: { defaultDepartment: false } });

  // Set new default
  await Department.findByIdAndUpdate(target._id, {
    $set: { defaultDepartment: true },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, target, "Default department set successfully"));
});
const getDefaultDepartment = asyncHandler(async (req, res) => {
  const department = await Department.findOne({ defaultDepartment: true });

  if (!department) {
    throw new ApiError(404, "No default department is set");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, department, "Default department retrieved"));
});

export {
  createDepartment,
  getDefaultDepartment,
  getAllDepartments,
  updateDepartment,
  getDepartment,
  deleteDepartment,
  updateImage,
  getDepartmentByName,
  updateBanner,
  importDepartments,
  updateMobileBanner,
  updateHomeImage,
  deleteBanner,
  deleteImage,
  deleteMobileBanner,
  deleteHomeImage,
  setDefaultDepartmentByIndex,
};
