import { Publisher, OrderCreatedEventData, Subjects } from "@sh-tickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEventData> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
