import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEventData } from "@sh-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { ticketModel } from "../../models/ticket.model";

export class TicketCreatedListener extends Listener<TicketCreatedEventData> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEventData["data"], msg: Message) {
    const { id, title, price } = data;

    const ticket = ticketModel.build({
      _id: id,
      title,
      price,
    });

    await ticket.save();
    msg.ack();
  }
}
