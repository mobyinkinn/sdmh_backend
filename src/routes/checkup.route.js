import Router from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createCheckup,
  updateImage,
  updateBanner,
  updateCheckup,
  deleteCheckup,
  getAllCheckups,
} from "../controllers/checkup.controller.js";

const router = Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "banner",
      maxCount: 1,
    },
  ]),
  createCheckup
);
router.route("/update").post(verifyJwt, updateCheckup);
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
router.route("/delete").get(verifyJwt, deleteCheckup);
router.route("/get-all").get(getAllCheckups);

export default router;
