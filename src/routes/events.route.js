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
  updateImage,
  getEventById,
} from "../controllers/events.controllers.js";

const router = Router();

router.route("/create").post(
  verifyJwt,
  upload.fields([
    { name: "images", maxCount: 6 },
    { name: "image", maxCount: 1 },
  ]),
  createEvents
);
router.route("/get-all").get(getAllEvents);
router.route("/update").post(verifyJwt, updateEvent);
router.route("/delete").get(verifyJwt, deleteEvent);
router.route("/delete-image").post(verifyJwt, deleteImage);
router.route("/update-image").post(
  verifyJwt,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  updateImage
);
router.route("/get-by-id").get(verifyJwt, getEventById);
router
  .route("/add-images")
  .post(verifyJwt, upload.fields([{ name: "images", maxCount: 5 }]), addImages);

export default router;
