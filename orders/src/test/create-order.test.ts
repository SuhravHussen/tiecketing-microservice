import request from "supertest";
import app from "../app";
import mockSignIn from "./mock-signin";
import { ticketModel } from "../models/ticket.model";
import { OrderModel } from "../models/order.model";
import { orderStatus } from "@sh-tickets/common";
import { natsWrapper } from "../nats-wrapper";
import mongoose from "mongoose";
jest.mock("../nats-wrapper");

it("give error if ticketId does not exist", async () => {
  const cookie = mockSignIn(true);

  await request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send({})
    .expect(400);
});

it("gives error if ticker is already reserved", async () => {
  const ticket = ticketModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = await OrderModel.build({
    ticket: ticket.id,
    userId: "1234",
    status: orderStatus.created,
    expiresAt: new Date(),
  });
  await order.save();

  const cookie = mockSignIn(true);

  await request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it("reserves a ticket", async () => {
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
});

it("emits an order created event", async () => {
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

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
