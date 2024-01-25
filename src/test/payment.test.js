import supertest from "supertest";
import { app } from "../application/app.js";
import { StatusCodes } from "http-status-codes";
import { createTestAdmin, createTestUser, loginUserorAdmin, removeMovies, removeShowtimes, removeTestAdmin, removeTestUser, createManyMovie, createOneMovie, createManyStudio, createStudio, removeStudio, removeSeat, createOneShowtime, createManyShowtimes, createShowTime, removeSeats, removeSeatBooking, createOneSeats, delay, createSeatBookingMany, createSeatBooking, removePayment, createSeats, createPayments, removeHistoryPayment } from "./utils.js";
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js";
import crypto from "crypto-js";
import { serverKey } from "../config.js";

describe("POST /api/v1/payment", () => {
  beforeEach(async () => {
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createSeats();
    await createShowTime();
    await createSeatBooking()
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

  it("should user can pay booking", async () => {

    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).post("/api/v1/payment").set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(StatusCodes.CREATED);
    expect(response.body.data).not.toBeNull()
    expect(response.body.transactionToken).not.toBeNull()
  })

})

describe("POST /api/v1/payment/notification", () => {
  beforeEach(async () => {
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createSeats();
    await createShowTime();
    await createSeatBooking()
    await createPayments()
  })

  afterEach(async () => {
    await removeHistoryPayment();
    await removePayment();
    await removeSeatBooking();
    await removeShowtimes();
    await removeSeats();
    await removeMovies();
    await removeStudio();
    await removeTestUser();
  })


  it("should success", async () => {

    const payment = await prismaClient.payments.findFirst()

    const notification = {
      order_id: payment.id,
      transaction_status: 'settlement',
      status_code: '200',
      gross_amount: payment.amount,
      signature_key: crypto.SHA512(payment.id + '200' + payment.amount + serverKey).toString()
    };

    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).post("/api/v1/payment/notification").set('Authorization', `Bearer ${token}`).send(notification);

    logger.info(response.body)

    expect(response.statusCode).toBe(StatusCodes.OK);
  })

})

