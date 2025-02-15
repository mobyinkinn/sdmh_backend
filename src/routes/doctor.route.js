import { Router } from "express";
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  updateDoctor,
  getDoctor,
  updateImage,
  updateDoctorsOrder,
} from "../controllers/doctors.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createDoctor
);
router.route("/update").post(verifyJwt, updateDoctor);
router.route("/update-image").post(
  verifyJwt,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updateImage
);
router.route("/delete").get(verifyJwt, deleteDoctor);
router.route("/get-all").get(getAllDoctors);
router.route("/get").post(getDoctor);
router.post("/update-doctors-order", updateDoctorsOrder);

export default router;
