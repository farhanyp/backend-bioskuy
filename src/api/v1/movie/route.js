import express from "express";
import { logger } from "../../../application/logging.js";
import MovieController from "./controller.js";
import { authenticateUser, authorizeRoles } from "../../../middleware/auth.js";

const router = new express.Router();

router.post("/api/v1/movie", authenticateUser, authorizeRoles('admin'), MovieController.create);
router.get("/api/v1/movies", authenticateUser, authorizeRoles('admin','user'), MovieController.index);
router.get("/api/v1/movie/:id", authenticateUser, authorizeRoles('admin','user'), MovieController.find);
router.patch("/api/v1/movie/:id", authenticateUser, authorizeRoles('admin'), MovieController.update);
router.delete("/api/v1/movie/:id", authenticateUser, authorizeRoles('admin'), MovieController.remove);

// router.post("/api/v1/movie/{:id}", MovieController.login);

export default router;
