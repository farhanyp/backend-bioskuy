import express from "express";
import { logger } from "../../../application/logging.js";
import PaymentController from "./controller.js";
import { authenticateUser, authorizeRoles } from "../../../middleware/auth.js";

const router = new express.Router();

router.post("/api/v1/payment", authenticateUser, authorizeRoles('user'), PaymentController.create);
router.get("/api/v1/payment", authenticateUser, authorizeRoles('user'), PaymentController.indexPayments);
router.post("/api/v1/payment/signature", authenticateUser, authorizeRoles('user'), PaymentController.getSignature);
router.post("/api/v1/payment/notification", authenticateUser, authorizeRoles('user'), PaymentController.notification);

export default router;
