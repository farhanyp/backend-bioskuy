import { app } from './src/application/app.js'
import { prismaClient } from './src/application/database.js';
import { logger } from './src/application/logging.js';
import { io, server } from "./src/application/websocket.js";
// import { completeBookingCronjob } from './src/cronJobsScheduler.js';
import { GetAllSeats, UpdateSeats } from './src/service/prisma/seat.js';

// completeBookingCronjob.start()
// deleteExpiredPaymentsCronjob.start()

app.get("/", (req, res) => {
  res.send("<h1>WebSocket dengan Express dan Socket.io</h1>");
});

io.on("connection", async (socket) => {
  console.log("Seorang pengguna terhubung");

  socket.on('get all seats', async (studioId) => {

    GetAllSeats(studioId).then(seats => {
      socket.emit('get all seats', seats);
    }).catch(error => {
      socket.emit('error', error.message);
    });

  });

})

io.disconnectSockets();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
