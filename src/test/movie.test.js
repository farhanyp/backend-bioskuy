import supertest from "supertest";
import { app } from "../application/app.js";
import { StatusCodes } from "http-status-codes";
import { createTestAdmin, createTestUser, loginUserorAdmin, removeMovies, removeTestAdmin, removeTestUser, createManyMovie, createOneMovie, createManyStudio } from "./utils.js";
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js";

describe("POST /api/v1/movie", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeMovies()
  });

  it("should admin can create movie", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const response = await supertest(app).post("/api/v1/movie").set('Authorization', `Bearer ${token}`).send({
      name: "tes1",
      description: "test1",
      price: 5000,
      status: "notShowing",
      genre: "action",
    });

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  it("user can't create movie", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).post("/api/v1/movie").set('Authorization', `Bearer ${token}`).send({
      name: "tes1",
      description: "test1",
      price: 5000,
      status: "notShowing",
    });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

});

describe("GET /api/v1/movies", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createManyMovie();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeMovies()
  });

  it("should admin get movies", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).get("/api/v1/movies").set('Authorization', `Bearer ${token}`);

    const result = await prismaClient.movies.aggregate({
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(10);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  it("should user can get movies", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).get("/api/v1/movies").set('Authorization', `Bearer ${token}`);

    const result = await prismaClient.movies.aggregate({
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(10);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

});

describe("GET /api/v1/movie/current", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createManyMovie();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeMovies()
  });

  it("should admin can create movie", async () => {

    const movie = await prismaClient.movies.findFirst();
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).get(`/api/v1/movie/${movie.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

});

describe("PATCH /api/v1/movie/current", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createManyMovie();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeMovies()
  });

  it("should admin can update movie", async () => {

    const movie = await prismaClient.movies.findFirst();
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const response = await supertest(app).patch(`/api/v1/movie/${movie.id}`).set('Authorization', `Bearer ${token}`).send({
      status: "showing"
    });

    const result = await prismaClient.movies.aggregate({
      where:{
        status: "showing"
      },
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(1);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });


  it("should user can't update movie", async () => {

    const movie = await prismaClient.movies.findFirst();
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).patch(`/api/v1/movie/${movie.id}`).set('Authorization', `Bearer ${token}`).send({
      status: "showing"
    });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

});

describe("DELETE /api/v1/movie/current", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createManyMovie();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeMovies()
  });

  it("should admin can delete movie", async () => {

    const movie = await prismaClient.movies.findFirst();
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const response = await supertest(app).delete(`/api/v1/movie/${movie.id}`).set('Authorization', `Bearer ${token}`).send();

    const result = await prismaClient.movies.aggregate({
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(9);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });


  it("should user can't delete movie", async () => {

    const movie = await prismaClient.movies.findFirst();
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).delete(`/api/v1/movie/${movie.id}`).set('Authorization', `Bearer ${token}`).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

});

