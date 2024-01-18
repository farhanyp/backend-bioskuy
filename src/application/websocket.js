import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { authenticateSocket, authorizeSocketRoles } from "../middleware/authForWebSocket.js";

export const server = http.createServer(app);
export const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
});

io.use(authenticateSocket);
io.use(authorizeSocketRoles('user', 'admin'));