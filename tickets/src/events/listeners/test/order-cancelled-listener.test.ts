import { order } from "./../../../../../orders/src/interfaces/order.interface";
import { OrderCancelledEventData, orderStatus } from "@sh-tickets/common";
import ticketModel from "../../../models/ticket.model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledListener } from "../order-cancelled-listener";
import mongoose from "mongoose";

jest.mock("../../../nats-wrapper");

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = ticketModel.build({
    title: "concert",
    price: 20,
    userId: "asdasd",
  });

  ticket.set({ orderId });

  await ticket.save();

  const data: OrderCancelledEventData["data"] = {
    id: orderId,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: ticket.version,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("updates the ticket, publishes an event, and acks the message", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await ticketModel.findById(ticket.id);

  expect(updatedTicket!.orderId).toBeNull();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
