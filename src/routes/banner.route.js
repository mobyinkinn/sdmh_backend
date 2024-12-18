import {
  createBanner,
  deleteBanner,
  getAllBanners,
  getBannerByPage,
  updateBanner,
} from "../controllers/banner.controller.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    {
      name: "banner",
      maxCount: 1,
    },
  ]),
  createBanner
);
router.route("/get-all").get(verifyJwt, getAllBanners);
router.route("/get-by-page").get(verifyJwt, getBannerByPage);
router.route("/update/").post(
  verifyJwt,
  upload.fields([
    {
      name: "banner",
      maxCount: 1,
    },
  ]),
  updateBanner
);
router.route("/delete").get(deleteBanner);

export default router;
