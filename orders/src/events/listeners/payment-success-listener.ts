import {
  Listener,
  PaymentSuccessEventData,
  Subjects,
  orderStatus,
} from "@sh-tickets/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { OrderModel } from "../../models/order.model";

export class PaymentsSuccessListener extends Listener<PaymentSuccessEventData> {
  readonly subject = Subjects.PaymentSuccess;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentSuccessEventData["data"], msg: Message) {
    const order = await OrderModel.findById(data.orderId);

    if (!order) {
      throw new Error("Order not found");
    }

    order.set({ status: orderStatus.complete });
    await order.save();
    msg.ack();
  }
}
