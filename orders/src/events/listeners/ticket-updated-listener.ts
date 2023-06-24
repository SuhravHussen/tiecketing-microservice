import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEventData,
  HttpException,
} from "@sh-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { ticketModel } from "../../models/ticket.model";

export class TicketUpdatedListener extends Listener<TicketUpdatedEventData> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEventData["data"], msg: Message) {
    try {
      const { id, title, price, version } = data;

      const ticket = await ticketModel.findOne({
        _id: id,
        version: version - 1,
      });

      if (!ticket) {
        throw new HttpException(404, "Ticket not found");
      }

      ticket.set({
        title,
        price,
      });
      await ticket.save();
      msg.ack();
    } catch (err) {}
  }
}
