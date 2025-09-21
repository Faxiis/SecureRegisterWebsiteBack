import { describe, it, expect } from 'vitest';
import request from "supertest";
import app from "../app.js"; // Assure-toi d'exporter ton app dans index.ts

let token: string;
let userId: string;

describe("Auth routes", () => {
  it("registers a new user", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "testuser", password: "Test123!" });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    userId = res.body.id;
  });

  it("fails to register with weak password", async () => {
    const res = await request(app)
      .post("/auth/register")
      .send({ username: "weakuser", password: "abc" });
    expect(res.statusCode).toBe(400);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "Test123!" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("fails login with wrong password", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "WrongPass!" });
    expect(res.statusCode).toBe(401);
  });
});

describe("Users routes", () => {
  it("lists users (protected)", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("gets user by id (protected)", async () => {
    const res = await request(app)
      .get(`/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id", userId);
  });

  it("returns 404 for unknown user", async () => {
    const res = await request(app)
      .get("/users/00000000-0000-0000-0000-000000000000")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("Bloom filter routes", () => {
  it("returns false for a random password", async () => {
    const res = await request(app)
      .get("/bloom/check?word=randompassword");
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.result).toBe("boolean");
  });
});
