import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
  getAllNavbars,
  createNavbar,
  updateNavbar,
  deleteNavbar,
  getNavbarById,
  importCustomers,
} from "../controllers/navbar.controller.js";
import { uploadCsv } from "../middlewares/multerCsv.middleware.js";

const router = Router();

router.route("/get-all").get(getAllNavbars);
router.route("/create").post(verifyJwt, createNavbar);
router.route("/update").post(verifyJwt, updateNavbar);
router.route("/delete").get(verifyJwt, deleteNavbar);
router.route("/get-by-id").get(getNavbarById);
router
  .route("/import-customers")
  .post(
    verifyJwt,
    uploadCsv.fields([{ name: "csv", maxCount: 1 }]),
    importCustomers
  );
export default router;
