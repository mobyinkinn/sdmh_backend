import { Router } from "express";
import {
  createAward,
  getAllAwards,
  updateAward,
  updateImage,
  deleteAward,
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
router.route("/delete").get(deleteAward);

export default router;
