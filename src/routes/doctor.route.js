import { Router } from "express";
import { createDoctor } from "../controllers/doctors.controller.js";

const router = Router();

router.route("/create").post(createDoctor);

export default router;
