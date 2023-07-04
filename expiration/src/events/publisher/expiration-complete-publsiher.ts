import {
  Publisher,
  Subjects,
  ExpirationCompleteEventData,
} from "@sh-tickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEventData> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
