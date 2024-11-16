import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createEvents } from "../controllers/events.controllers.js";
const router = Router();

router
  .route("/create")
  .post(verifyJwt, upload.fields([{ name: "image", maxCount: 1 }]), createEvents);

export default router;
