import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getAllNavbars,
  createNavbar,
  updateNavbar,
  deleteNavbar,
} from "../controllers/navbar.controller.js";

const router = Router();

router.route("/get-all").get(getAllNavbars);
router.route("/create").post(verifyJwt, createNavbar);
router.route("/update").post(verifyJwt, updateNavbar);
router.route("/delete").get(verifyJwt, deleteNavbar);

export default router;
