import { Router } from "express";
import {
  createAward,
  getAllAwards,
  updateAward,
  updateImage,
  deleteAward,
  getAwardById,
} from "../controllers/awards.controller.js";
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
  createAward
);
router.route("/get-all").get(getAllAwards);
router.route("/update").post(verifyJwt, updateAward);
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
router.route("/delete").get(verifyJwt, deleteAward);
router.route("/get-by-id").get(verifyJwt, getAwardById);

export default router;
