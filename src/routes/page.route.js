import { Router } from "express";
import {
  updateNotices,
  deleteNotice,
  updateFile,
  blockNotice,
  unblockNotice,
} from "../controllers/notices.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPage, getAllPages } from "../controllers/pages.controller.js";

const router = Router();

router.route("/create").post(verifyJwt, createPage);

router.route("/get-all").get(getAllPages);
router.route("/update").post(verifyJwt, updateNotices);
router.route("/delete").get(verifyJwt, deleteNotice);
export default router;
