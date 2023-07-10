import request from "supertest";

import app from "../app";
import mockSignIn from "./mock-signin";
import mongoose from "mongoose";
import { orderModel } from "../models/order";
import { orderStatus } from "@sh-tickets/common";
import { userId } from "./mock-signin";
import { paymentsModel } from "../models/payments";
import { natsWrapper } from "../nats-wrapper";

jest.mock("../stripe");
jest.mock("../nats-wrapper");

it("returns 404 if the order doesnt exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", mockSignIn(true))
    .send({
      token: "asdasdasd",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns 401 if the order doesnt belong to the user", async () => {
  const order = orderModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    status: orderStatus.created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", mockSignIn(true))
    .send({
      token: "asdasdasd",
      orderId: order.id,
    })
    .expect(401);
});

it("returns 400 if the order is cancelled", async () => {
  const order = orderModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    status: orderStatus.cancelled,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", mockSignIn(true))
    .send({
      token: "asdasdasd",
      orderId: order.id,
    })
    .expect(400);
});

it("returns 200 if the order and token is valid and saves payment", async () => {
  const order = orderModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    status: orderStatus.created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", mockSignIn(true))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(200);

  const payment = await paymentsModel.findOne({ orderId: order.id });

  expect(payment?.orderId).toEqual(order.id);
  expect(payment).not.toBeNull();
});

it("publishes an event", async () => {
  const order = orderModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    price: 20,
    status: orderStatus.created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", mockSignIn(true))
    .send({
      token: "tok_visa",
      orderId: order.id,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
