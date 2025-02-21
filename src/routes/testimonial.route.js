import { Router } from "express";
import {
  blockTestimonial,
  createTestimonial,
  deleteTestimonial,
  getAllTestimonials,
  unblockTestimonial,
} from "../controllers/testimonial.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router
  .route("/create")
  .post(upload.fields([{ name: "image", maxCount: 1 }]), createTestimonial);
router.route("/delete").get(verifyJwt, deleteTestimonial);
router.route("/get-all").get(getAllTestimonials);
router.route("/block-testimonial").patch(verifyJwt, blockTestimonial);
router.route("/unblock-testimonial").patch(verifyJwt,unblockTestimonial);


export default router;
