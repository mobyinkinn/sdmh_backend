import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createNewspress,
  getAllNewspress,
  updateNewspress,
  deleteNewspress,
  updateImage,
  updateBanner,
  getNewspressById,
} from "../controllers/newspress.controller.js";

const router = Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  createNewspress
);
router.route("/get-all").get(getAllNewspress);
router.route("/update").post(verifyJwt, updateNewspress);
router.route("/delete").get(verifyJwt, deleteNewspress);
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
router.route("/get-by-id").get(verifyJwt, getNewspressById);

export default router;
