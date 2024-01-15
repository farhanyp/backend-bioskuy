import express from "express";
import { PORT } from "./src/config.js";
import { app } from "./src/application/app.js";

app.listen(PORT || 3000, () => {
  console.log(`Server Running in http://localhost:${PORT}`);
});
