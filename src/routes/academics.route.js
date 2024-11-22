import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createAcademics,
  getAllAcademics,
  getAcademics,
  updateAcademics,
  deleteAcademics,
  getById,
} from "../controllers/academics.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  createAcademics
);
router.route("/get-all").get(getAllAcademics);
router.route("/get").post(getAcademics);
router.route("/get").get(getById);
router.route("/update").post(verifyJwt, updateAcademics);
router.route("/delete").get(verifyJwt, deleteAcademics);

export default router;
