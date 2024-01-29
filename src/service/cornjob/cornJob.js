import { prismaClient } from "../../application/database.js";

export const completeBookingTask = async () => {
      const currentTime = new Date();

      const showtimes = await prismaClient.showtimes.findMany({
        where: {
          show_end: {
            lt: currentTime
          }
        },
        include: {
          seatbooking: true
        }
      });
  
      await Promise.all(showtimes.map(async (showtime) => {
        await Promise.all(showtime.seatbooking.map(async (booking) => {
          await prismaClient.seatBookings.update({
            where: { id: booking.id, status: "active" },
            data: { status: 'completed' }
          });
  
          await prismaClient.seats.update({
            where: { id: booking.seat_id },
            data: { isAvailable: true }
          });
        }));
      }));
  };  

export const deleteExpiredPaymentsTask = async () => {
    const now = new Date();
    let payments = await prismaClient.payments.findMany({
    where: {
        status: 'unpaid'
    },
    include: {
        seatbooking: true
    }
    });
    
    for(let i = 0; i < payments.length; i++){
      let expirationTime = new Date(payments[i].createdAt.getMinutes()).getTime();
      if (expirationTime < now.getTime()) {
        await prismaClient.payments.delete({
          where: { id: payments[i].id }
        });
        await prismaClient.seatBookings.delete({
          where: { id: payments[i].seatbooking.id }
        });
      }
    }
};