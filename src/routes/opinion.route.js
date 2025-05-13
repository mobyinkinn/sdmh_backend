import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createOpinion,
  deleteOpinion,
  getAllOpinions,
} from "../controllers/opinion.controller.js";

const router = Router();

router
  .route("/create")
  .post(
    upload.fields([{ name: "images", maxCount: 6 }]),
    createOpinion
  );
router.route("/get-all").get(verifyJwt, getAllOpinions);
router.route("/delete").get(verifyJwt, deleteOpinion);

export default router;
