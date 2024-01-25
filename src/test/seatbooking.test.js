import supertest from "supertest";
import { app } from "../application/app.js";
import { StatusCodes } from "http-status-codes";
import { createTestAdmin, createTestUser, loginUserorAdmin, removeMovies, removeShowtimes, removeTestAdmin, removeTestUser, createManyMovie, createOneMovie, createManyStudio, createStudio, removeStudio, removeSeat, createOneShowtime, createManyShowtimes, createShowTime, removeSeats, removeSeatBooking, createOneSeats, delay, createSeatBookingMany } from "./utils.js";
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js";

describe("POST /api/v1/booking", () => {
  beforeEach(async () => {
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createOneSeats();
    await createShowTime();
  })

  afterEach(async () => {
    await removeSeatBooking();
    await removeShowtimes();
    await removeSeats();
    await removeMovies();
    await removeStudio();
    await removeTestUser();
  })

  it("should user can booking", async () => {

    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const showtime = await prismaClient.showtimes.findFirst();
    const seat = await prismaClient.seats.findFirst();

    const response = await supertest(app).post("/api/v1/booking").set('Authorization', `Bearer ${token}`).send({showtime_id: showtime.id, seat_id: seat.id, status: 'pending'});

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  })

  it("should can handle race condition", async () => {

    const token1 = await loginUserorAdmin({ email: "test@example.com", password: "test"})
    const token2 = await loginUserorAdmin({ email: "test2@example.com", password: "test"})

    const showtime = await prismaClient.showtimes.findFirst();
    const seat = await prismaClient.seats.findFirst();

    const promise1 = delay(200, supertest(app).post("/api/v1/booking").set('Authorization', `Bearer ${token1}`).send({ showtime_id: showtime.id, seat_id: seat.id, status: "pending"}));
    const promise2 = supertest(app).post("/api/v1/booking").set('Authorization', `Bearer ${token2}`).send({ showtime_id: showtime.id, seat_id: seat.id, status: "pending"})

    const results = await Promise.allSettled([promise1, promise2]);

    const successfulBookings = results.filter(result => result.status === 'fulfilled' && result.value.statusCode === StatusCodes.CREATED).length;

    expect(successfulBookings).toBe(1);
  });

})