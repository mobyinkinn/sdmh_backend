import { Router } from "express";
import {
  blockTpa,
  createTpa,
  deleteTpa,
  getAllTpas,
  getTpa,
  unblockTpa,
  updateTpa,
  updateLogo,
} from "../controllers/tpa.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/create")
  .post(verifyJwt, upload.fields([{ name: "logo", maxCount: 1 }]), createTpa);
router.route("/get-all").get(getAllTpas);
router.route("/update").post(verifyJwt, updateTpa);
router.route("/get").post(getTpa);
router.route("/delete").get(verifyJwt, deleteTpa);
router.route("/block-tpa").patch(verifyJwt, blockTpa);
router.route("/unblock-tpa").patch(verifyJwt, unblockTpa);
router
  .route("/update-logo")
  .post(verifyJwt, upload.fields([{ name: "logo", maxCount: 1 }]), updateLogo);

export default router;
