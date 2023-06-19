import request from "supertest";
import app from "../app";
import mockSignIn from "./mock-signin";
import { ticketModel } from "../models/ticket.model";
import { OrderModel } from "../models/order.model";
import { orderStatus } from "@sh-tickets/common";
import mongoose from "mongoose";
import { natsWrapper } from "../nats-wrapper";

it("gives error if order does not exist", async () => {
  const cookie = mockSignIn(true);

  await request(app)
    .patch("/api/orders/cancel/" + new mongoose.Types.ObjectId().toHexString())
    .set("Cookie", cookie)
    .send({})
    .expect(404);
});

it("gives error if order does not belong to user", async () => {
  const ticket = ticketModel.build({
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
    .patch(`/api/orders/cancel/${order.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(401);
});

it("cancels an order", async () => {
  const ticket = ticketModel.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const cookie = mockSignIn(true);

  const order = await request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  console.log(order.body);
  const res = await request(app)
    .patch(`/api/orders/cancel/${order.body.data.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(res.body.data.status).toEqual(orderStatus.cancelled);
});

it("publishes an event", async () => {
  const ticket = ticketModel.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const cookie = mockSignIn(true);

  const order = await request(app)
    .post("/api/orders/create")
    .set("Cookie", cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);

  await request(app)
    .patch(`/api/orders/cancel/${order.body.data.id}`)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
