import { prismaClient } from "../../application/database.js";
import { io } from "../../application/websocket.js";

  export async function GetAllSeats() {
    try {
      const seats = await prismaClient.seats.findMany();
      io.emit('get all seats', seats);
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  export const UpdateSeats = (socket) => {
    try {
      socket.on("update seat", async (...data) => {

        for (let index = 1; index < data.length; index++) {
          await prismaClient.seats.update({
            where: {
              id: data[index],
            },
            data: {
              isAvailable: data[0],
            },
          })
        }
      })
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }