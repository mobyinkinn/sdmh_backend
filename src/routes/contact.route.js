import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createContact,
  getAllContacts,
  deleteContact,
} from "../controllers/contact.controller.js";

const router = Router();

router.route("/create").post(createContact);
router.route("/get-all").get(verifyJwt, getAllContacts);
router.route("/delete").get(verifyJwt, deleteContact);

export default router;
