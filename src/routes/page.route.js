import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  createPage,
  getAllPages,
  updatePage,
  deletePage,
} from "../controllers/pages.controller.js";

const router = Router();

router.route("/create").post(verifyJwt, createPage);
router.route("/get-all").get(getAllPages);
router.route("/update").post(verifyJwt, updatePage);
router.route("/delete").get(verifyJwt, deletePage);

export default router;
