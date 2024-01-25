import express from "express";
import { logger } from "../../../application/logging.js";
import SeatBookingController from "./controller.js";
import { authenticateUser, authorizeRoles } from "../../../middleware/auth.js";

const router = new express.Router();

router.post("/api/v1/booking", authenticateUser, authorizeRoles('user'), SeatBookingController.create);

export default router;
