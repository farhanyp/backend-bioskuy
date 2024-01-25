import bcryptjs from 'bcryptjs'
import { StatusCodes } from "http-status-codes";
import { prismaClient } from "../../application/database.js";
import { ResponseError } from "../../error/response-error.js";
import { validate } from "../../validation/validation.js";
import { createSeatBookingValidation } from '../../validation/seatbooking-validation.js';
import { logger } from '../../application/logging.js';

const createSeatBooking = async (req) => {  

  let status = req.body.status || "cancelled";

  let data = {}
  data.user_id = req.user.userId
  data.seat_id = req.body.seat_id
  data.showtime_id = req.body.showtime_id
  data.status = status

  data = validate(createSeatBookingValidation, data) 

  const result = await prismaClient.$transaction(async (prisma) => {
    const user = await prisma.users.findFirst({
      where:{
        id: data.user_id
      }
    })
    if(!user) throw new ResponseError(StatusCodes.UNAUTHORIZED, "Need login first")


    const showtime = await prisma.showtimes.findFirst({
      where:{
        id: data.showtime_id
      }
    })
    if(!showtime) throw new ResponseError(StatusCodes.NOT_FOUND, "Showtime not found")


    const seat = await prisma.seats.findFirst({
      where:{
        id: data.seat_id,
        studio_id: showtime.studio_id
      }
    })
    if(!seat) throw new ResponseError(StatusCodes.NOT_FOUND, "Seat not found")

    const existingBooking = await prisma.seatBookings.findFirst({
      where: {
        seat_id: data.seat_id,
        showtime_id: data.showtime_id,
        status: {
          in: ["active", "pending"]
        }
      }
    });

    if (existingBooking) {
      throw new ResponseError(StatusCodes.CONFLICT, "Seat is already booked");
    } 

    return prisma.seatBookings.create({
        data: data
    });
  })

  return result
}

export {
  createSeatBooking
  };