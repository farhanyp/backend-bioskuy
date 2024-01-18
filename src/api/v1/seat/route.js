import express from "express";
import { logger } from "../../../application/logging.js";
import SeatController from "./controller.js";
import { authenticateUser, authorizeRoles } from "../../../middleware/auth.js";

const router = new express.Router();

// router.post("/api/v1/studio", authenticateUser, authorizeRoles('admin'), SeatController.create);
// router.get("/api/v1/studios", authenticateUser, authorizeRoles('admin','user'), SeatController.index);
// router.get("/api/v1/studio/:id", authenticateUser, authorizeRoles('admin','user'), SeatController.find);
// router.delete("/api/v1/studio/:id", authenticateUser, authorizeRoles('admin'), SeatController.remove);

export default router;
