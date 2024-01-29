import supertest from "supertest";
import { app } from "../application/app.js";
import { StatusCodes } from "http-status-codes";
import { createTestAdmin, createTestUser, loginUserorAdmin, removeMovies, removeShowtimes, removeTestAdmin, removeTestUser, createManyMovie, createOneMovie, createManyStudio, createStudio, removeStudio, removeSeat, createOneShowtime, createManyShowtimes, createShowTime, removeSeats, removeSeatBooking, createOneSeats, delay, createSeatBookingMany, createSeatBooking, removePayment, createSeats, createPayments, removeHistoryPayment, createSeatCronJob, createSeatBookingCronJob, createShowTimeCronJob, createPaymentsCronJob } from "./utils.js";
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js";
import crypto from "crypto-js";
import { serverKey } from "../config.js";
import { completeBookingTask, deleteExpiredPaymentsTask } from "../service/cornjob/cornJob.js";

describe("Complete Booking Task", () => {
  beforeEach(async () => {
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createSeatCronJob();
    await createShowTimeCronJob();
    await createSeatBookingCronJob()
    await createPayments()
  })

  afterEach(async () => {
    await removePayment()
    await removeSeatBooking();
    await removeShowtimes();
    await removeSeats();
    await removeMovies();
    await removeStudio();
    await removeTestUser();
  })

  it("should update the status of seat bookings and availability of seats", async () => {
    // Persiapkan dan periksa kondisi awal
    const initialSeatBooking = await prismaClient.seatBookings.findFirst({
      where: { status: 'active' },
      include: {
        showtime: true
      }
    });
    expect(initialSeatBooking).not.toBeNull();

    const initialSeat = await prismaClient.seats.findUnique({
      where: { id: initialSeatBooking.seat_id }
    });
    expect(initialSeat.isAvailable).toBe(false);

    // Jalankan fungsi
    const compleBooking = await completeBookingTask();

    // Periksa kondisi setelah eksekusi
    const updatedSeatBooking = await prismaClient.seatBookings.findUnique({
      where: { id: initialSeatBooking.id }
    });
    expect(updatedSeatBooking.status).toBe('completed');

    const updatedSeat = await prismaClient.seats.findUnique({
      where: { id: initialSeatBooking.seat_id }
    });
    expect(updatedSeat.isAvailable).toBe(true);
  });
})

describe("Complete Payment Task", () => {
  beforeEach(async () => {
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createSeatCronJob();
    await createShowTimeCronJob();
    await createSeatBookingCronJob()
    await createPaymentsCronJob()
  })

  afterEach(async () => {
    await removePayment()
    await removeSeatBooking();
    await removeShowtimes();
    await removeSeats();
    await removeMovies();
    await removeStudio();
    await removeTestUser();
  })

  it("should delete expired payments if unpaid", async () => {

    const initialPaymentCount = await prismaClient.payments.count({
      _count:{
        id:true
      }
    });

    const initialBookingCount = await prismaClient.seatBookings.aggregate({
      _count:{
        id:true
      }
    });

    await deleteExpiredPaymentsTask();

    const finalPaymentCount = await prismaClient.payments.aggregate({
      _count:{
        id:true
      }
    });

    const finalBookingCount = await prismaClient.seatBookings.aggregate({
      _count:{
        id:true
      }
    });

    expect(finalPaymentCount._count.id).toBe(0);
    expect(finalBookingCount._count.id).toBe(0);

    logger.info(finalPaymentCount);
  });

})

