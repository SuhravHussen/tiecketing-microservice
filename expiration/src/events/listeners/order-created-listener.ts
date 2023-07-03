import { Listener, OrderCreatedEventData, Subjects } from "@sh-tickets/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiratiom-queue";

export class OrderCreatedListener extends Listener<OrderCreatedEventData> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = "expiration-service";

  async onMessage(data: OrderCreatedEventData["data"], msg: Message) {
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay: 10000,
      }
    );
    msg.ack();
  }
}
