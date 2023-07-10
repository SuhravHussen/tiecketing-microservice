import {
  PaymentSuccessEventData,
  Publisher,
  Subjects,
} from "@sh-tickets/common";

export class PaymentSuccessPublisher extends Publisher<PaymentSuccessEventData> {
  readonly subject = Subjects.PaymentSuccess;
}
