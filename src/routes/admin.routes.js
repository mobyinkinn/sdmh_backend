import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  registerAdmin,
  updateAccountDetails,
  deleteAccount,
} from "../controllers/admin.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);

//secured routes
router.route("/logout").post(verifyJwt, logoutAdmin);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJwt, changeCurrentPassword);
router.route("/get-admin").get(verifyJwt, getCurrentAdmin);
router.route("/update-admin").post(verifyJwt, updateAccountDetails);
router.route("/delete-admin").get(verifyJwt, deleteAccount);

export default router;
