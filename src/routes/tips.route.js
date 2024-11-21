import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createTip,
  deleteTip,
  getAllTips,
  updateTip,
  updateImage,
} from "../controllers/tips.controller.js";

const router = Router();

router
  .route("/create")
  .post(verifyJwt, upload.fields([{ name: "image", maxCount: 1 }]), createTip);

router.route("/get-all").get(getAllTips);
router.route("/update").post(updateTip);
router
  .route("/update-image")
  .post(
    verifyJwt,
    upload.fields([{ name: "image", maxCount: 1 }]),
    updateImage
  );
router.route("/delete").get(deleteTip);

export default router;
