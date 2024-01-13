import supertest from "supertest";
import app from "../../index.js";
import { StatusCodes } from "http-status-codes";
import { createTestUser, removeTestUser } from "./utils.js";
import { logger } from "../application/logging.js";

describe("POST /api/v1/auth/register", () => {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should register a new user", async () => {
    const response = await supertest(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "test@example.com",
      password: "test",
      role: "user",
    });

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  it("should return 400 for invalid data", async () => {
    await createTestUser();

    const response = await supertest(app).post("/api/v1/auth/register").send({
      name: "",
      email: "invalidemail",
      password: "pass",
      role: "unknown",
    });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });

  it("should return 400 for existing user", async () => {
    await createTestUser();

    const response = await supertest(app).post("/api/v1/auth/register").send({
      name: "test",
      email: "test@example.com",
      password: "test",
      role: "user",
    });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});

describe("POST /api/v1/auth/login", () => {
  beforeEach(async () => {
    await createTestUser();
  });

  afterEach(async () => {
    await removeTestUser();
  });

  it("should login success", async () => {
    const response = await supertest(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "test",
    });

    expect(response.statusCode).toBe(StatusCodes.CREATED);
  });

  it("should login failed with wrong email", async () => {
    const response = await supertest(app).post("/api/v1/auth/login").send({
      email: "testwrong@example.com",
      password: "test",
    });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should login failed with wrong password", async () => {
    const response = await supertest(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "testwrong",
    });

    expect(response.statusCode).toBe(StatusCodes.UNAUTHORIZED);
  });

  it("should login failed invalid input", async () => {
    const response = await supertest(app).post("/api/v1/auth/login").send({
      email: "",
      password: "",
    });

    expect(response.statusCode).toBe(StatusCodes.BAD_REQUEST);
  });
});
