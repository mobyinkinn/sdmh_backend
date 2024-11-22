import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createEvents,
  getAllEvents,
  updateEvent,
  deleteEvent,
  deleteImage,
  addImages,
} from "../controllers/events.controllers.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJwt,
    upload.fields([{ name: "images", maxCount: 6 }]),
    createEvents
  );
router.route("/get-all").get(getAllEvents);
router.route("/update").post(verifyJwt, updateEvent);
router.route("/delete").get(verifyJwt, deleteEvent);
router.route("/delete-image").post(verifyJwt, deleteImage);
router
  .route("/add-images")
  .post(verifyJwt, upload.fields([{ name: "images", maxCount: 5 }]), addImages);

export default router;
