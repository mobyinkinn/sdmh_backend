import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createVideo,
  deleteVideo,
  getAllVideos,
  updateVideo,
} from "../controllers/video.controller.js";

const router = Router();

router.route("/create").post(verifyJwt, createVideo);
router.route("/update").post(verifyJwt, updateVideo);
router.route("/delete").post(verifyJwt, deleteVideo);
router.route("/get-all").get(getAllVideos);

export default router;
