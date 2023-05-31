import request from "supertest";
import app from "../app";

it("must be signed in to create a ticket", async () => {
  const cookieValue = "session=shdjsdbhjsd; Path=/;";
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookieValue)
    .send({})
    .expect(401);
});

it("must return an error if an invalid title is provided", async () => {});

it("must return an error if an invalid price is provided", async () => {});

it("must create a ticket with valid inputs", async () => {});
