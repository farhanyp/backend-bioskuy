import express from "express";
import UserRouter from "../api/v1/user/route.js";
import MovieRouter from "../api/v1/movie/route.js";
import { errorMiddleware } from "../middleware/error-middleware.js";

export const app = express();
app.use(express.json());

app.use(UserRouter);
app.use(MovieRouter);

app.use(errorMiddleware);