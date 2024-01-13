import express from "express";
import { PORT } from "./src/config.js";
import { logger } from "./src/application/logging.js";
import UserRouter from "./src/api/v1/user/route.js";
import { errorMiddleware } from "./src/middleware/error-middleware.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(UserRouter);

app.use(errorMiddleware);

app.listen(PORT || 3000, () => {
  console.log(`Server Running in http://localhost:${PORT}`);
});

export default app;
