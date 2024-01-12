import express from "express";
import { PORT } from "./src/config.js";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.listen(PORT || 3000, () => {
  console.log(`Server Running in http://localhost:${PORT}`);
});
