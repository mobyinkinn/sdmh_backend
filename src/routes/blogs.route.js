import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  addImages,
  blockBlog,
  createBlogs,
  deleteBlog,
  getAllBlogs,
  getBannerById,
  unblockBlog,
  updateBlog,
  updateImage,
  updateImages,
  deleteImage,
} from "../controllers/blogs.controller.js";

const router = Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    { name: "images", maxCount: 6 },
    { name: "image", maxCount: 1 },
  ]),
  createBlogs
);
router.route("/get-all").get(getAllBlogs);
router.route("/update").post(verifyJwt, updateBlog);
router.route("/delete").get(verifyJwt, deleteBlog);
router.route("/block-blog").patch(verifyJwt, blockBlog);
router.route("/unblock-blog").patch(verifyJwt, unblockBlog);
router.route("/get-by-id").get(verifyJwt, getBannerById);
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
router.route("/update-images").post(
  verifyJwt,
  upload.fields([
    {
      name: "images",
      maxCount: 6,
    },
  ]),
  updateImages
);

router.route("/delete-image").post(verifyJwt, deleteImage);
router
  .route("/add-images")
  .post(verifyJwt, upload.fields([{ name: "images", maxCount: 5 }]), addImages);

export default router;
