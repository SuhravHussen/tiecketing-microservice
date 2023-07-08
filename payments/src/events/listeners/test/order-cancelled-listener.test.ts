import { OrderCancelledEventData, orderStatus } from "@sh-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import { orderModel } from "../../../models/order";
import mongoose from "mongoose";
jest.mock("../../../nats-wrapper");

const setUp = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = orderModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
    status: orderStatus.created,
    userId: "asdf",
    version: 0,
  });

  await order.save();

  const data: OrderCancelledEventData["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "asdf",
      price: 10,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, order };
};

it("updates the status of the order", async () => {
  const { listener, data, msg, order } = await setUp();

  await listener.onMessage(data, msg);

  const updatedOrder = await orderModel.findById(order.id);

  expect(updatedOrder!.status).toEqual(orderStatus.cancelled);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setUp();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
