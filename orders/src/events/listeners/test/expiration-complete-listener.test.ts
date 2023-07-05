import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { ticketModel } from "../../../models/ticket.model";
import { OrderModel } from "../../../models/order.model";
import { orderStatus } from "@sh-tickets/common";

jest.mock("../../../nats-wrapper");

const setup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  const ticket = ticketModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  const order = OrderModel.build({
    status: orderStatus.created,
    userId: "asdasd",
    expiresAt: new Date(),
    ticket: ticket.id,
  });
  await order.save();

  const data = {
    orderId: order.id.toString(),
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, order };
};

it("updates the order status to cancelled", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  const updatedOrder = await OrderModel.findById(order.id);
  expect(updatedOrder!.status).toEqual(orderStatus.cancelled);
});

it("emits an OrderCancelled event", async () => {
  const { listener, data, msg, order } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
