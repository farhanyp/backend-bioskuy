import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const jwtSecret = process.env.JWT_SECRET;
const jwtExpiration = process.env.JWT_EXPIRATION;
const clientKey = process.env.CLIENT_KEY
const serverKey = process.env.SERVER_KEY

export { PORT, jwtSecret, jwtExpiration, clientKey, serverKey};
