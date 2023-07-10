import mongoose from "mongoose";

export interface Payments {
  orderId: string;
  stripeId: string;
}

export interface PaymentsDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  version: number;
}

export interface PaymentsModel extends mongoose.Model<PaymentsDoc> {
  build(attrs: Payments): PaymentsDoc;
}
