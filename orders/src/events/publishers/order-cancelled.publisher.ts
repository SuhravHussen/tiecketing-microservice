import {
  Publisher,
  Subjects,
  OrderCancelledEventData,
} from "@sh-tickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEventData> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
