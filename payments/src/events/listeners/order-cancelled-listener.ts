import {
  Listener,
  OrderCancelledEventData,
  Subjects,
  orderStatus,
} from "@sh-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { orderModel } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEventData> {
  readonly subject = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEventData["data"], msg: Message) {
    const order = await orderModel.findById(data.id);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: orderStatus.cancelled });
    await order.save();

    msg.ack();
  }
}
