import {
  Publisher,
  Subjects,
  TicketCreatedEventData,
} from "@sh-tickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventData> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
