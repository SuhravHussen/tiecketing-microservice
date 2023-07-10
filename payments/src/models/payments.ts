import mongoose, { Schema } from "mongoose";
import {
  Payments,
  PaymentsDoc,
  PaymentsModel,
} from "../interface/payments.interface";

const paymentsSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentsSchema.statics.build = (attrs: Payments) => {
  return new paymentsModel(attrs);
};

const paymentsModel = mongoose.model<PaymentsDoc, PaymentsModel>(
  "payments",
  paymentsSchema
);

export { paymentsModel };
