import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createCareer,
  getAllCareers,
  deleteCareer,
  blockCareers,
  unblockCareers,
} from "../controllers/careers.controller.js";

const router = Router();

router
  .route("/create")
  .post(
    verifyJwt,
    upload.fields([{ name: "resume", maxCount: 1 }]),
    createCareer
  );
router.route("/get-all").get(getAllCareers);
router.route("/delete").get(verifyJwt, deleteCareer);
router.route("/block-careers").patch(verifyJwt, blockCareers);
router.route("/unblock-careers").patch(verifyJwt, unblockCareers);

export default router;
