import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  registerAdmin,
} from "../controllers/admin.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);

//secured routes
router.route("/logout").post(verifyJwt, logoutAdmin);
router.route("/refresh-token").post(refreshAccessToken);

export default router;
