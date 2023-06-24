import request from "supertest";
import app from "../app";
import mockSignIn from "./mock-signin";
import { ticketModel } from "../models/ticket.model";
import mongoose from "mongoose";
jest.mock("../nats-wrapper");

it("if user is not signed in, it returns 401", async () => {
  await request(app).get("/api/orders/all").send({}).expect(401);
});

it("return 404 if no orders found", async () => {
  const cookie = mockSignIn(true);

  await request(app)
    .get("/api/orders/all")
    .set("Cookie", cookie)
    .send({})
    .expect(404);
});

it("returns orders if found", async () => {
  const ticket = ticketModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const cookie = mockSignIn(true);

  await request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const res = await request(app)
    .get("/api/orders/all")
    .set("Cookie", cookie)
    .send({});

  expect(res.body.data[0].ticket.id).toEqual(ticket.id);
});

it("return user's order", async () => {
  const ticketOne = ticketModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert one",
    price: 20,
  });
  await ticketOne.save();

  const ticketTwo = ticketModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert two",
    price: 50,
  });
  await ticketTwo.save();

  const user1 = mockSignIn(true, true);
  const user2 = mockSignIn(true, true);

  await request(app)
    .post("/api/orders/create")
    .set("Cookie", user1)
    .send({
      ticketId: ticketOne.id,
    })
    .expect(201);

  await request(app)
    .post("/api/orders/create")
    .set("Cookie", user2)
    .send({
      ticketId: ticketTwo.id,
    })
    .expect(201);

  const res = await request(app)
    .get("/api/orders/")
    .set("Cookie", user2)
    .send({})
    .expect(200);
  expect(res.body.data[0].ticket.id).toEqual(ticketTwo.id);
});

it("return order information", async () => {
  const ticket = ticketModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const cookie = mockSignIn(true);

  const { body } = await request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  const res = await request(app)
    .get(`/api/orders/${body.data.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(res.body.data.ticket.id).toEqual(ticket.id);
});

it("return 401 if order doesn't belong to user", async () => {
  const ticket = ticketModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const cookie = mockSignIn(true);

  const { body } = await request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .get(`/api/orders/${body.data.id}`)
    .set("Cookie", mockSignIn(true, true))
    .send({})
    .expect(401);
});
