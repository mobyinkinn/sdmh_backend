import { asyncHandler } from "../utils/asyncHandler";

const registerAdmin = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "ok",
  });
});

export { registerAdmin };
