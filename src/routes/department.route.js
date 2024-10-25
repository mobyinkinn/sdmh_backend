import { Router } from "express";
import {
  createDepartment,
  deleteDepartment,
  getDepartments,
  updateDepartment,
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

router.route("/get-all").get(getDepartments);
router.route("/update").post(verifyJwt, updateDepartment);
router.route("/delete").get(verifyJwt, deleteDepartment);

export default router;
