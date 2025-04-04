import { Router } from "express";
import {
  createDownloadable,
  getAllDownloadables,
  updateDownloadables,
  deleteDownloadables,
  updateFile,
} from "../controllers/downloadables.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJwt,
    upload.fields([{ name: "file", maxCount: 1 }]),
    createDownloadable
  );

router.route("/get-all").get(getAllDownloadables);
router.route("/update").post(verifyJwt, updateDownloadables);
router
  .route("/update-file")
  .post(verifyJwt, upload.fields([{ name: "file", maxCount: 1 }]), updateFile);
router.route("/delete").get(verifyJwt, deleteDownloadables);

export default router;
