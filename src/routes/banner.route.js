import {
  blockBanner,
  createBanner,
  deleteBanner,
  getAllBanners,
  getBannerByPage,
  unblockBanner,
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
      name: "images",
      maxCount: 3,
    },
    {
      name: "mobileimages",
      maxCount: 3,
    },
    {
      name: "banner",
      maxCount: 1,
    },
    {
      name: "mobileBanner",
      maxCount: 1,
    },
  ]),
  createBanner
);
router.route("/get-all").get(getAllBanners);
router.route("/get-by-page").get(getBannerByPage);
router.route("/update").post(
  verifyJwt,
  upload.fields([
   {
      name: "images",
      maxCount: 3,
    },
    {
      name: "mobileimages",
      maxCount: 3,
    },
    {
      name: "banner",
      maxCount: 1,
    },
    {
      name: "mobileBanner",
      maxCount: 1,
    },
  ]),
  updateBanner
);
router.route("/delete").get(verifyJwt, deleteBanner);
router.route("/block-banner").patch(verifyJwt, blockBanner);
router.route("/unblock-banner").patch(verifyJwt, unblockBanner);

export default router;
