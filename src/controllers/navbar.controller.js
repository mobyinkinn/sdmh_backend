import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Navbar } from "../models/navbar.model.js";

const createNavbar = asyncHandler(async (req, res) => {
  const { orderId, name, link, items } = req.body;

  if (!orderId || !name || !link) {
    throw new ApiError(400, "Please fill the required fields!!!");
  }

  if (items && Array.isArray(items)) {
    for (const item of items) {
      if (!item.subItemOrderId || !item.itemName || !item.itemLink) {
        throw new ApiError(
          400,
          "Each item in the items array must have subItemOrderId, itemName, and itemLink"
        );
      }
    }
  }

  const navbar = await Navbar.create(req.body);
  if (!navbar) {
    throw new ApiError(500, "Something went wrong while creating the navbar");
  }

  res.status(200).json(new ApiResponse(200, "Navbar created", navbar));
});

const getAllNavbars = asyncHandler(async (req, res) => {
  const navbars = await Navbar.find();

  if (!navbars) {
    throw new ApiError(500, "Something went wrong fetching the navbars");
  }

  res.status(200).json(new ApiResponse(200, "Navbars sent", navbars));
});

const updateNavbar = asyncHandler(async (req, res) => {
  const { orderId, name, link, items } = req.body;

  if (!name && !link && !orderId && !items) {
    throw new ApiError(400, "At least one field is required for update!!!");
  }

  if (items && Array.isArray(items)) {
    for (const item of items) {
      if (!item.subItemOrderId || !item.itemName || !item.itemLink) {
        throw new ApiError(
          400,
          "Each item in the items array must have subItemOrderId, itemName, and itemLink"
        );
      }
    }
  }

  const navbar = await Navbar.findById(req.query.id);
  if (!navbar) {
    throw new ApiError(400, "Navbar not found!!!");
  }

  const updatedNavbar = await Navbar.findByIdAndUpdate(
    req.query.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!updatedNavbar) {
    throw new ApiError(
      500,
      "Something went wrong while updating the navbar!!!"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Navbar updated successfully", updatedNavbar));
});

const deleteNavbar = asyncHandler(async (req, res) => {
  const navbar = await Navbar.findById(req.query.id);
  if (!navbar) {
    throw new ApiError(400, "No navbar found!!!");
  }

  const deletedNavbar = await Navbar.findByIdAndDelete(req.query.id);
  if (!deletedNavbar) {
    throw new ApiError(
      500,
      "Something went wrong while deleting the navbar!!!"
    );
  }

  res.status(200).json(new ApiResponse(200, "Navbar deleted successfully"));
});

const getNavbarById = asyncHandler(async (req, res) => {
  const { _id } = req.query;

  if (!_id) {
    throw new ApiError(400, "Navbar is required!!!");
  }

  const navbar = await Navbar.findOne({ _id });
  if (!navbar) {
    throw new ApiError(400, "No navbar found");
  }

  res.status(200).json(new ApiResponse(200, "navbar by id!!!", navbar));
});
const importCustomers = asyncHandler(async (req, res) => {
  const csvLocalPath = req.files?.csv[0]?.path;
  // console.log(req.files);
  if (!csvLocalPath) {
    throw new ApiError(400, "Upload the file");
  }

  const requiredFields = [
    "subItemOrderId",
    "itemName",
    "itemLink",
  ];

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

          results.push(row);
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const savedEntries = [];
    for (const entry of results) {
      const customer = await Navbar.create(entry);
      savedEntries.push(customer);
    }

    fs.unlinkSync(csvLocalPath);
    if (errors) {
      res.status(400).json({
        message: "Some required fields are missing",
        errors, // Include errors in the response if needed
      });
      res.status(200).json({
        message: "Customers imported successfully",
      });
    }
  } catch (error) {
    fs.unlinkSync(csvLocalPath); // Clean up uploaded file
    return res.status(500).json({ message: "Error processing CSV", error });
  }
});
export {
  getAllNavbars,
  createNavbar,
  updateNavbar,
  deleteNavbar,
  getNavbarById,
  importCustomers,
};
