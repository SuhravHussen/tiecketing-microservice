import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import { OrderCreatedEventData, orderStatus } from "@sh-tickets/common";
import { Message } from "node-nats-streaming";
import { orderModel } from "../../../models/order";
jest.mock("../../../nats-wrapper");

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEventData["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "asdf",
    userId: "asdf",
    ticket: {
      id: "asdf",
      price: 10,
    },
    status: orderStatus.created,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await orderModel.findById(data.id);

  expect(order!.price).toEqual(data.ticket.price);
  expect(order!.status).toEqual(data.status);
  expect(order!.userId).toEqual(data.userId);
  expect(order!.version).toEqual(data.version);
  expect(order!.id).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
