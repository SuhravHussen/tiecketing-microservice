import mongoose from "mongoose";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEventData } from "@sh-tickets/common";
import { Message } from "node-nats-streaming";
import { ticketModel } from "../../../models/ticket.model";
import { TicketUpdatedListener } from "../ticket-updated-listener";
jest.mock("../../../nats-wrapper");

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create a ticket
  const ticket = ticketModel.build({
    _id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  // Create a fake data event
  const data: TicketUpdatedEventData["data"] = {
    id: ticket.id as unknown as string,
    title: ticket.title,
    price: 40,
    userId: "asdasd",
    version: ticket.version + 1,
  };
  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, data, ticket, msg };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, data, ticket, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure a ticket was created!
  const updatedTicket = await ticketModel.findById(ticket.id);
  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();
  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);
  // Write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
