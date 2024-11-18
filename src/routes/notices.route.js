import { Router } from "express";
import {
  createNotice,
  getAllNotices,
  updateNotices,
  deleteNotice,
  updateFile,
} from "../controllers/notices.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJwt,
    upload.fields([{ name: "file", maxCount: 1 }]),
    createNotice
  );

router.route("/get-all").get(getAllNotices);
router.route("/update").post(verifyJwt, updateNotices);
router
  .route("/update-file")
  .post(verifyJwt, upload.fields([{ name: "file", maxCount: 1 }]), updateFile);
router.route("/delete").get(verifyJwt, deleteNotice);

export default router;
