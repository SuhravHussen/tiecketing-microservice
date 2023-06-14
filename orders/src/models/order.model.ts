import { Schema, model } from "mongoose";
import {
  order,
  orderDocument,
  orderModelInterface,
} from "../interfaces/order.interface";
import { orderStatus } from "@sh-tickets/common";
const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(orderStatus),
      default: orderStatus.created,
    },
    expiresAt: {
      type: Schema.Types.Date,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (props: order) => {
  return new OrderModel(props);
};

const OrderModel = model<orderDocument, orderModelInterface>(
  "Order",
  orderSchema
);
