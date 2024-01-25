import { app } from './src/application/app.js'
import { logger } from './src/application/logging.js';
import { io, server } from "./src/application/websocket.js";
import { deleteExpiredPayments } from './src/service/prisma/payment.js';
import { GetAllSeats, UpdateSeats } from './src/service/prisma/seat.js';

app.get("/", (req, res) => {
  res.send("<h1>WebSocket dengan Express dan Socket.io</h1>");
});

io.on("connection", async (socket) => {
  console.log("Seorang pengguna terhubung");

  GetAllSeats();
  UpdateSeats(socket)
  deleteExpiredPayments()
  completeSeatWhenShowEnded()

  setInterval(GetAllSeats, 5000);
  setInterval(deleteExpiredPayments, 1000);
  setInterval(completeSeatWhenShowEnded, 10000);

})

io.disconnectSockets();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
