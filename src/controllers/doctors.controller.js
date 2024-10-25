import { Doctor } from "../models/doctors.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createDoctor = asyncHandler(async (req, res) => {
  const {
    name,
    image,
    department,
    designation,
    availablity,
    floor,
    room,
    about,
    status,
  } = req.body;

  console.log(req.body);

  return res.send("0k");
});

export { createDoctor };
