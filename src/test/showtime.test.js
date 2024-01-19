import supertest from "supertest";
import { app } from "../application/app.js";
import { StatusCodes } from "http-status-codes";
import { createTestAdmin, createTestUser, loginUserorAdmin, removeMovies, removeTestAdmin, removeTestUser, createManyMovie, createOneMovie, createManyStudio, createStudio, removeStudio, removeSeat, removeShowtimes, createOneShowtime, createManyShowtimes, createShowTime } from "./utils.js";
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js";

describe("POST /api/v1/showtime", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createOneMovie();
    await createStudio();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeShowtimes();
    await removeMovies();
    await removeStudio();
  });

  it("should admin can create showtime", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const movie = await prismaClient.movies.findFirst();
    const studio = await prismaClient.studios.findFirst();

    const response = await supertest(app).post("/api/v1/showtime").set('Authorization', `Bearer ${token}`).send({
      movie_id: movie.id,
      studio_id: studio.id, 
      show_start: new Date('2024-01-18T07:00:00Z'),
      show_end: new Date('2024-01-18T10:00:00Z')
    });

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  it("should admin can't create showtime if there between another showtime in one studio", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const movie = await prismaClient.movies.findFirst();
    const studio = await prismaClient.studios.findFirst();

    await supertest(app).post("/api/v1/showtime").set('Authorization', `Bearer ${token}`).send({
      movie_id: movie.id,
      studio_id: studio.id, 
      show_start: new Date('2024-01-18T07:00:00Z'),
      show_end: new Date('2024-01-18T10:00:00Z')
    });

    const response = await supertest(app).post("/api/v1/showtime").set('Authorization', `Bearer ${token}`).send({
      movie_id: movie.id,
      studio_id: studio.id, 
      show_start: new Date('2024-01-18T07:00:00Z'),
      show_end: new Date('2024-01-18T11:00:00Z')
    });

    console.log(response.body)

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should user can't create showtime", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const movie = await prismaClient.movies.findFirst();
    const studio = await prismaClient.studios.findFirst();

    const response = await supertest(app).post("/api/v1/showtime").set('Authorization', `Bearer ${token}`).send({
      movie_id: movie.id,
      studio_id: studio.id, 
      show_start: new Date('2024-01-18T07:00:00Z'),
      show_end: new Date('2024-01-18T10:00:00Z')
    });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });


  it("should invalid input error", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const movie = await prismaClient.movies.findFirst();
    const studio = await prismaClient.studios.findFirst();

    const response = await supertest(app).post("/api/v1/showtime").set('Authorization', `Bearer ${token}`).send({
      movie_id: movie.id,
      studio_id: studio.id, 
      show_start: "",
      show_end:""
    });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

});

describe("GET /api/v1/showtimes", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createManyShowtimes()
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeShowtimes();
    await removeMovies();
    await removeStudio();
  });

  it("should admin get showtimes", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const response = await supertest(app).get("/api/v1/showtimes").set('Authorization', `Bearer ${token}`);

    const result = await prismaClient.showtimes.aggregate({
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(3);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  it("should user get showtimes", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).get("/api/v1/showtimes").set('Authorization', `Bearer ${token}`);

    const result = await prismaClient.showtimes.aggregate({
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(3);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

});

describe("GET /api/v1/showtime/current", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createManyShowtimes()
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeShowtimes();
    await removeMovies();
    await removeStudio();
  });

  it("should admin get showtime", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const showtime = await prismaClient.showtimes.findFirst()

    const response = await supertest(app).get(`/api/v1/showtime/${showtime.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  it("should user get showtime", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const showtime = await prismaClient.showtimes.findFirst()

    const response = await supertest(app).get(`/api/v1/showtime/${showtime.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

});

describe("PATCH /api/v1/showtime/current", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createShowTime()
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeShowtimes();
    await removeMovies();
    await removeStudio();
  });

  it("should admin update showtime", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const showtime = await prismaClient.showtimes.findFirst()

    const response = await supertest(app).patch(`/api/v1/showtime/${showtime.id}`).set('Authorization', `Bearer ${token}`).send({
      show_start: new Date('2024-01-18T11:00:00Z')
    });

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  it("should user update showtime", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const showtime = await prismaClient.showtimes.findFirst()

    const response = await supertest(app).patch(`/api/v1/showtime/${showtime.id}`).set('Authorization', `Bearer ${token}`).send({
      show_start: new Date('2024-01-18T11:00:00Z')
    });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

});

describe("DELETE /api/v1/showtime/current", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createOneMovie();
    await createStudio();
    await createShowTime()
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeMovies();
    await removeStudio();
  });

  it("should admin delete showtime", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const showtime = await prismaClient.showtimes.findFirst()

    const response = await supertest(app).delete(`/api/v1/showtime/${showtime.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

});

