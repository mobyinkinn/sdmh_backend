import { Router } from "express";
import { createDepartment } from "../controllers/department.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(
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

export default router;
