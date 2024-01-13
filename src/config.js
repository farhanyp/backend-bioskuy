import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;

export { PORT, jwtSecret, jwtExpiration };
