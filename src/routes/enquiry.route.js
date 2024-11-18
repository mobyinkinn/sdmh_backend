import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createEnquiry,
  deleteEnquiry,
  getAllEnquiries,
} from "../controllers/enquiry.controller.js";

const router = Router();

router.route("/create").post(createEnquiry);
router.route("/get-all").get(verifyJwt, getAllEnquiries);
router.route("/delete").get(verifyJwt, deleteEnquiry);

export default router;
