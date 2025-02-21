import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createMetadata, deleteMetadataById, getMetadata, getMetadataByPageName, updateMetadataById } from "../controllers/seo.controller.js";

const router = Router();

router.route("/create-metadata").post(createMetadata);
router.route("/get-all").get(getMetadata);
router.route("/getByPageName").get(getMetadataByPageName);
router.route("/deleteById").delete(deleteMetadataById);
router.route("/updateById").put(updateMetadataById);


export default router;
