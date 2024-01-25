import bcryptjs from 'bcryptjs'
import midtransClient from 'midtrans-client';
import { StatusCodes } from "http-status-codes";
import { prismaClient } from "../../application/database.js";
import { ResponseError } from "../../error/response-error.js";
import { validate } from "../../validation/validation.js";
import { logger } from '../../application/logging.js';
import { createPaymentValidation } from '../../validation/payment-validation.js';
import { clientKey, serverKey } from '../../config.js';
import cron from 'node-cron';
import crypto from "crypto-js";

const createPayments = async (req) => {

  const user = req.user 

  const seatBooking = await prismaClient.seatBookings.findFirst({
    where:{
      user_id: user.user_id,
      status: "pending"
    }
  })
  if(!seatBooking) throw new ResponseError(StatusCodes.NOT_FOUND, "Seat Booking not found")

  const totalBooking = await prismaClient.seatBookings.aggregate({
    where:{
      user_id: user.user_id,
      status: "pending"
    },
    _count:{
      seat_id:true
    }
  })

  const moviePrice = await prismaClient.seatBookings.findFirst({
    where:{
      user_id: user.user_id,
      status: "pending"
    },
    include:{
      showtime: {
        include: {
          movie: true
        }
      }
    }
  })

  let finalPrice = totalBooking._count.seat_id * moviePrice.showtime.movie.price

    
  let snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : serverKey,
    clientKey : clientKey
  });
  
  let parameter = {
    "transaction_details": {
      "order_id": seatBooking.id,
      "gross_amount": finalPrice
    }
  };

  const transaction = await snap.createTransaction(parameter);
  const transactionToken = transaction.token;

  const payment = await prismaClient.payments.create({
    data:{
      seatbooking_id: seatBooking.id,
      amount: finalPrice,
      status: "unpaid",
      transaction_token: transactionToken
    }
  })

  return { payment, transactionToken };
}

const notificationPayments = async (req) => {

  const notification = req.body;

  if (!notification.order_id) throw new ResponseError(404, "Payments Not Found")

  const booking = await prismaClient.payments.findFirst({
    where:{
      id: notification.order_id
    },
    include:{
      seatbooking:{
        include:{
          seat: true
        }
      }
    }
  })

  const isValidNotification = await verifyNotification(notification);
  if (!isValidNotification) throw new ResponseError(401, 'Notification invalid')

  switch (notification.transaction_status) {
    case 'settlement':
        await updateBookingStatus(booking.seatbooking.id, 'active');
        await updateSeatStatus(booking.seatbooking.seat.id, false);
        await updatePaymentStatus(notification.order_id, 'paid');
        break;
    case 'pending':
      await updateBookingStatus(notification.order_id, 'pending');
    case 'cancel':
      await updateBookingStatus(notification.order_id, 'cancelled');
    case 'expire':
      await updateBookingStatus(notification.order_id, 'cancelled');
    case 'deny':
        await updateBookingStatus(notification.order_id, 'cancelled');
        break;
    default:
        console.log('Status transaksi tidak dikenal:', notification.transaction_status);
  }

  async function verifyNotification(notification) {
    const key = serverKey; 
    const orderId = notification.order_id;
    const statusCode = notification.status_code;
    const grossAmount = notification.gross_amount;
    const signatureKey = notification.signature_key;
  
    const stringToHash = orderId + statusCode + grossAmount + key;
    const mySignatureKey = crypto.SHA512(stringToHash).toString();
  
    return mySignatureKey === signatureKey
  }

  async function updateBookingStatus(orderId, status) {
    await prismaClient.seatBookings.update({
        where: { id: orderId },
        data: { status: status }
    });
  }

    async function updateSeatStatus(orderId, status) {
    await prismaClient.seats.update({
        where: { id: orderId },
        data: { isAvailable: status }
    });
  }

  async function updatePaymentStatus(orderId, status) {
    await prismaClient.payments.update({
        where: { id: orderId },
        data: { status: status }
    });
  }

  const paymentsHistory = await prismaClient.paymentsHistory.create({
    data:{
      payments_id: notification.order_id,
      amount: notification.gross_amount,
      status: 'paid'
    }
  })

  return paymentsHistory
}

const deleteExpiredPayments = async() => {
  const now = new Date();
  let payments = await prismaClient.payments.findMany({
    where: {
      status: 'unpaid'
    },
    include:{
      seatbooking: true
    }
  });

  for (const payment of payments) {
    expirationTime = new Date(payment.createdAt.getTime() + 30 * 60000).getTime();
    if (expirationTime < now) {
      await prismaClient.payments.delete({
        where: { id: payment.id }
      });
      await prismaClient.seatBookings.delete({
        where: { id: payment.seatbooking.id }
      });
    }
    io.emit('paymentDeleted', { paymentId: payment.id });
  }
}

const completeSeatWhenShowEnded = async() => {
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

  showtimes.forEach(async (showtime) => {
    await Promise.all(showtime.seatbooking.map(async (booking) => {
        await prismaClient.seatBookings.update({
            where: { id: booking.id, status: "active"},
            data: { status: 'completed' }
        });

        await prismaClient.seats.update({
            where: { id: booking.seat_id },
            data: { isAvailable: true }
        });
    }));
});

}


export {
  createPayments,
  notificationPayments,
  deleteExpiredPayments,
  completeSeatWhenShowEnded
  };