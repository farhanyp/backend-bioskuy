import express from "express";
import { logger } from "../../../application/logging.js";
import UserController from "./controller.js";

const router = new express.Router();

router.post("/api/v1/auth/register", UserController.create);

router.post("/api/v1/auth/login", UserController.login);

export default router;
