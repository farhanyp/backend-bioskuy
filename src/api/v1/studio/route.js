import express from "express";
import { logger } from "../../../application/logging.js";
import StudioController from "./controller.js";
import { authenticateUser, authorizeRoles } from "../../../middleware/auth.js";

const router = new express.Router();

router.post("/api/v1/studio", authenticateUser, authorizeRoles('admin'), StudioController.create);
router.get("/api/v1/studios", authenticateUser, authorizeRoles('admin','user'), StudioController.index);
router.get("/api/v1/studio/:id", authenticateUser, authorizeRoles('admin','user'), StudioController.find);
router.delete("/api/v1/studio/:id", authenticateUser, authorizeRoles('admin'), StudioController.remove);

export default router;
