import supertest from "supertest";
import { app } from "../application/app.js";
import { StatusCodes } from "http-status-codes";
import { createTestAdmin, createTestUser, loginUserorAdmin, removeMovies, removeTestAdmin, removeTestUser, createManyMovie, createOneMovie, removeStudio, createManyStudio, removeSeat } from "./utils.js";
import { logger } from "../application/logging.js";
import { prismaClient } from "../application/database.js";

describe("POST /api/v1/studio", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeSeat()
    await removeStudio()
  });

  it("should admin can create studio", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const response = await supertest(app).post("/api/v1/studio").set('Authorization', `Bearer ${token}`).send({
      name: "tes1",
      capcity: 30,
      maxRowSeat: 10
    });

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  it("user can't create studio", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).post("/api/v1/studio").set('Authorization', `Bearer ${token}`).send({
      name: "tes1",
      capcity: 10,
      maxRowSeat: 10
    });


    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

});

describe("GET /api/v1/studios", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createManyStudio();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeStudio()
  });

  it("should admin get studios", async () => {
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const response = await supertest(app).get("/api/v1/studios").set('Authorization', `Bearer ${token}`);

    const result = await prismaClient.studios.aggregate({
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(10);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

  it("should user can get studios", async () => {
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).get("/api/v1/studios").set('Authorization', `Bearer ${token}`);

    const result = await prismaClient.studios.aggregate({
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(10);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });

});

describe("GET /api/v1/studio/current", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createManyStudio();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeStudio()
  });

  it("should user can get studio current", async () => {

    const studio = await prismaClient.studios.findFirst();
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).get(`/api/v1/studio/${studio.id}`).set('Authorization', `Bearer ${token}`);

    expect(response.statusCode).toBe(StatusCodes.OK);
  });

});

describe("DELETE /api/v1/studio/current", () => {
  beforeEach(async () => {
    await createTestAdmin();
    await createTestUser();
    await createManyStudio();
  });

  afterEach(async () => {
    await removeTestAdmin();
    await removeTestUser();
    await removeSeat()
    await removeStudio()
  });

  it("should admin can delete studio", async () => {

    const studio = await prismaClient.studios.findFirst();
    
    const token = await loginUserorAdmin({
      email: "admin@example.com",
      password: "test",
    })

    const response = await supertest(app).delete(`/api/v1/studio/${studio.id}`).set('Authorization', `Bearer ${token}`).send();

    const result = await prismaClient.studios.aggregate({
      _count:{
        id: true
      }
    })

    expect(result._count.id).toBe(9);
    expect(response.statusCode).toBe(StatusCodes.OK);
  });


  it("should user can't delete studio", async () => {

    const studio = await prismaClient.studios.findFirst();
    
    const token = await loginUserorAdmin({
      email: "test@example.com",
      password: "test",
    })

    const response = await supertest(app).delete(`/api/v1/studio/${studio.id}`).set('Authorization', `Bearer ${token}`).send();

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

});
