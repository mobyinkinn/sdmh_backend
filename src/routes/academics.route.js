import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { createAcademics } from "../controllers/academics.controller.js";

const router = Router();

router.route("/create").post(
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  createAcademics
);

export default router;
