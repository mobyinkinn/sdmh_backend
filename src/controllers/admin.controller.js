import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async (adminId) => {
  try {
    const admin = await Admin.findById(adminId);
    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while creating refresh and access tokens"
    );
  }
};

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

  if (!(isSuperAdmin === true || isSuperAdmin === false)) {
    throw new ApiError(400, "Admin type is required");
  }

  if (!(status === true || status === false)) {
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

const loginAdmin = asyncHandler(async (req, res) => {
  /**
   * 1. body -> data
   * 2. username or email
   * 3. find the user
   * 4. password check
   * 5. access and refresh token generation
   * 6. send cookies (token)
   * 7. send response
   */

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, "Admin does not exist");
  }

  const isPasswordValid = await admin.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentails");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    admin._id
  );

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { admin: loggedInAdmin, accessToken, refreshToken },
        "Admin logged in successfully"
      )
    );
});

const logoutAdmin = asyncHandler(async (req, res) => {
  Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "unauthorized request");
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id);

    if (!admin) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== admin?.refreshToken) {
      throw new ApiError(401, "Refresh token expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(admin._id);

    return res
      .status(200)
      .cookie("acessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Acess token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;

  const admin = await Admin.findById(req.query.id);

  admin.password = password;
  await admin.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfullly"));
});

const getCurrentAdmin = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.admin, "Current user fetched successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    name,
    menu,
    submenu,
    donations,
    isSuperAdmin,
    status,
  } = req.body;

  if (
    !username &&
    !email &&
    !name &&
    !menu &&
    !submenu &&
    !donations &&
    !(isSuperAdmin === true || isSuperAdmin === false) &&
    !(status === true || status === false)
  ) {
    throw new ApiError(400, "All fields are empty");
  }
  console.log(req.body);

  const admin = await Admin.findByIdAndUpdate(
    req.query.id,
    {
      $set: req.body,
    },
    { new: true }
  ).select("-password");

  if (!admin) {
    throw new ApiError(500, "Something went wrong while updating the admin!!!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, admin, "Account details updated successfully"));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const { id } = req.query;

  const deleteAdmin = await Admin.findById(id);

  if (!deleteAdmin) {
    throw new ApiError(400, "No such admin exists");
  }

  const superAdmin = req.admin;
  if (!superAdmin.isSuperAdmin) {
    throw new ApiError(400, "Only a super admin can remove other users");
  }

  await Admin.deleteOne({ _id: id });

  return res
    .status(200)
    .json(new ApiResponse(200, "Admin removed successfully."));
});

const getAllAdmin = asyncHandler(async (req, res) => {
  const admins = await Admin.find();
  if (!admins) {
    throw new ApiError(500, "Something went wrong while fetching the admin!!!");
  }
  res
    .status(200)
    .json(new ApiResponse(200, "Admins fetched successfully!!!", admins));
});

export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentAdmin,
  updateAccountDetails,
  deleteAccount,
  getAllAdmin,
};
