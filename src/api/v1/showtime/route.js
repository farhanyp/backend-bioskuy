import express from "express";
import { logger } from "../../../application/logging.js";
import ShowtimeController from "./controller.js";
import { authenticateUser, authorizeRoles } from "../../../middleware/auth.js";

const router = new express.Router();

router.post("/api/v1/showtime", authenticateUser, authorizeRoles('admin'), ShowtimeController.create);
router.get("/api/v1/showtimes", authenticateUser, authorizeRoles('admin','user'), ShowtimeController.index);
router.get("/api/v1/showtime/:id", authenticateUser, authorizeRoles('admin','user'), ShowtimeController.find);
router.patch("/api/v1/showtime/:id", authenticateUser, authorizeRoles('admin'), ShowtimeController.update);
router.delete("/api/v1/showtime/:id", authenticateUser, authorizeRoles('admin'), ShowtimeController.remove);

// router.post("/api/v1/movie/{:id}", MovieController.login);

export default router;
