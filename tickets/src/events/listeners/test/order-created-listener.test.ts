import { OrderCreatedEventData, orderStatus } from "@sh-tickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedListener } from "../order-created-listener";
import ticketModel from "../../../models/ticket.model";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
jest.mock("../../../nats-wrapper");
const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = ticketModel.build({
    title: "concert",
    price: 20,
    userId: "asdasd",
  });

  await ticket.save();

  const data: OrderCreatedEventData["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    userId: "shdjshds",
    status: orderStatus.created,
    expiresAt: "asdasd",
    version: ticket.version,
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("sets the userId of the ticket", async () => {
  const { listener, data, msg, ticket } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await ticketModel.findById(ticket.id);
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
