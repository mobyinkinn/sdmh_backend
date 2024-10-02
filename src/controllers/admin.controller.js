import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerAdmin = asyncHandler(async (req, res) => {
  /**
   *
   * username
   * email
   * password
   * name
   * menu
   * submenu
   * donations
   * isSuperAdmin
   * status
   * refreshToken
   *
   * 0. get admin details listed above
   * 1. check if the details are valid
   * 2. check if username and email is unique
   * 3. create admin object
   * 4. create entry in database
   * 5. create token
   * 6. remove password and refersh token from the respons
   * 7. check if the user is created
   * 8. send response
   *
   *
   *  */

  const {
    username,
    email,
    password,
    name,
    menu,
    submenu,
    donations,
    isSuperAdmin,
    status,
    refreshToken,
  } = req.body;

  console.log(req.body);

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are compulsory");
  }

  if (!isSuperAdmin) {
    throw new ApiError(400, "Admin type is required");
  }

  if (!status) {
    throw new ApiError(400, "Admin status is required");
  }

  const existingAdmin = await Admin.findOne({
    $or: [{ username }, { email }],
  });

  if (existingAdmin) {
    console.log(existingAdmin);
    throw new ApiError(409, "Username or email already exists");
  }

  const admin = await Admin.create({
    username,
    email,
    password,
    name,
    menu,
    submenu,
    donations,
    isSuperAdmin,
    status,
  });

  const createdAdmin = await Admin.findById(admin._id).select(
    "-passowrd -refreshToken"
  );

  if (!createdAdmin) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdAdmin, "Admin created successfully"));
});

export { registerAdmin };
