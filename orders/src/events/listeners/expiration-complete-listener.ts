import {
  ExpirationCompleteEventData,
  HttpException,
  Listener,
  Subjects,
  orderStatus,
} from "@sh-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderModel } from "../../models/order.model";
import { OrderCancelledPublisher } from "../publishers/order-cancelled.publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEventData> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(
    data: ExpirationCompleteEventData["data"],
    msg: Message
  ): Promise<void> {
    const { orderId } = data;
    const order = await OrderModel.findById(orderId).populate("ticket");

    if (!order) {
      throw new HttpException(404, "Order not found");
    }

    if (order.status === "complete") {
      return msg.ack();
    }

    order.set({
      status: orderStatus.cancelled,
    });
    await order.save();
    let price = 0;
    if ("price" in order.ticket) {
      price = order.ticket.price;
    }
    new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id.toString(),
        price: price,
      },
    });
    msg.ack();
  }
}
