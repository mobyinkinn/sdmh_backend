import { Router } from "express";
import {
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
} from "../controllers/testimonial.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router
  .route("/create")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createTestimonial);
router.route("/delete").get(verifyJwt, deleteTestimonial);
router.route("/get-all").get(verifyJwt, getAllTestimonials);

export default router;
