import { Router } from "express";
import {
  createTeaching,
  getAllTeachings,
  updateTeachings,
  deleteTeaching,
  updateFile,
  blockTeaching,
  unblockTeaching,
} from "../controllers/teachings.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJwt,
    upload.fields([{ name: "file", maxCount: 1 }]),
    createTeaching
  );

router.route("/get-all").get(getAllTeachings);
router.route("/update").post(verifyJwt, updateTeachings);
router
  .route("/update-file")
  .post(verifyJwt, upload.fields([{ name: "file", maxCount: 1 }]), updateFile);
router.route("/delete").get(verifyJwt, deleteTeaching);
router.route("/block-teaching").patch(verifyJwt, blockTeaching);
router.route("/unblock-teaching").patch(verifyJwt, unblockTeaching);
export default router;
