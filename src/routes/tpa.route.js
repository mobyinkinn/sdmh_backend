import { Router } from "express";
import {
  createTpa,
  getAllTpas,
  getTpa,
  updateTpa,
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

export default router;
