import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  updateImage,
  updateBanner,
  getDepartmentByName,
} from "../controllers/department.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "bannerImage",
      maxCount: 1,
    },
  ]),
  createDepartment
);

router.route("/get-all").get(getAllDepartments);
router.route("/get").post(getDepartment);
router.route("/getbyId").get( getDepartmentByName);
router.route("/update").post(verifyJwt, updateDepartment);
router.route("/delete").get(verifyJwt, deleteDepartment);
router
  .route("/update-image")
  .post(
    verifyJwt,
    upload.fields([{ name: "image", maxCount: 1 }]),
    updateImage
  );
router
  .route("/update-banner")
  .post(
    verifyJwt,
    upload.fields([{ name: "banner", maxCount: 1 }]),
    updateBanner
  );

export default router;
