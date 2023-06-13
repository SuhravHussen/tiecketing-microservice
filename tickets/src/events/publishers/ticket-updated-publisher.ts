import {
  Publisher,
  Subjects,
  TicketUpdatedEventData,
} from "@sh-tickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEventData> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
