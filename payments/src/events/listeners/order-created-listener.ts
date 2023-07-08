import {
  Listener,
  OrderCreatedEventData,
  Subjects,
  orderStatus,
} from "@sh-tickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { orderModel } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEventData> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCreatedEventData["data"],
    msg: Message
  ): Promise<void> {
    const order = orderModel.build({
      _id: data.id,
      price: data.ticket.price,
      status: orderStatus.created,
      userId: data.userId,
      version: data.version,
    });
    await order.save();
    msg.ack();
  }
}
