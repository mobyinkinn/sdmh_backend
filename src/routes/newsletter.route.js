import { Router } from "express";
import {
  createNewsletter,
  getAllNewsletters,
  deleteNewsletter,
} from "../controllers/newsletter.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create").post(verifyJwt, createNewsletter);
router.route("/get-all").get(getAllNewsletters);
router.route("/delete").post(verifyJwt, deleteNewsletter);

export default router;
