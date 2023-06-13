import request from "supertest";
import app from "../app";
import mockSignIn from "./mock-signin";

jest.mock("../nats-wrapper");

it("must be signed in to create a ticket", async () => {
  const cookie = mockSignIn(false);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({})
    .expect(401);
});

it("must return an error if an invalid title is provided", async () => {
  const cookie = mockSignIn(true);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      price: 10,
    })
    .expect(400);
});

it("must return an error if an invalid price is provided", async () => {
  const cookie = mockSignIn(true);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: -10,
    })
    .expect(400);
  await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
    })
    .expect(400);
});

it("must create a ticket with valid inputs", async () => {
  const cookie = mockSignIn(true);

  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({
      title: "test",
      price: 10,
    })
    .expect(201);

  expect(res.body.data.title).toEqual("test");
  expect(res.body.data.price).toEqual(10);
  expect(res.body.data.userId).toBeDefined();
});
