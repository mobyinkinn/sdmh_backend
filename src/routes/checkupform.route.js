import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteOpinion,
} from "../controllers/opinion.controller.js";
import { createCheckup, getAllCheckups } from "../controllers/checkupform.controller.js";

const router = Router();

router.route("/create").post(verifyJwt, createCheckup);
router.route("/get-all").get(verifyJwt, getAllCheckups);
router.route("/delete").get(verifyJwt, deleteOpinion);

export default router;
