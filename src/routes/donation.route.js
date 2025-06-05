import { Router } from "express";
import { createDonation } from "../controllers/donation.controller.js";

const router = Router();

router.route("/initiate").post(createDonation);

export default router;
