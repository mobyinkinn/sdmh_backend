import { Router } from "express";
import {
  createDoctor,
  deleteDoctor,
  getAllDoctors,
  updateDoctor,
  getDoctor,
  updateImage,
  getDoctorByName,
  getDoctorByID,
  updateDoctorsOrder,
  importDoctors,
} from "../controllers/doctors.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadCsv } from "../middlewares/multerCsv.middleware.js";

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
router.route("/update").patch(verifyJwt, updateDoctor);
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
router.route("/getbyId").get(getDoctorByName);

router.route("/getdoctorbyId").get(getDoctorByID);

router.post("/update-doctors-order", updateDoctorsOrder);

router
  .route("/import-doctors")
  .post(
    verifyJwt,
    uploadCsv.fields([{ name: "csv", maxCount: 1 }]),
    importDoctors
  );

export default router;
