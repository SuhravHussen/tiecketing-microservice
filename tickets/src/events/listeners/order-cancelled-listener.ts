import {
  Listener,
  OrderCancelledEventData,
  Subjects,
} from "@sh-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import ticketModel from "../../models/ticket.model";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEventData> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEventData["data"], msg: Message) {
    try {
      const { ticket } = data;

      const ticketData = await ticketModel.findById(ticket.id);

      if (!ticketData) {
        throw new Error("Ticket not found");
      }

      ticketData.set({ orderId: null });
      await ticketData.save();
      await new TicketUpdatedPublisher(this.client).publish({
        id: ticketData.id,
        price: ticketData.price,
        title: ticketData.title,
        userId: ticketData.userId,
        orderId: ticketData.orderId,
        version: ticketData.version,
      });
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
