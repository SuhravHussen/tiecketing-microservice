import { Schema, model } from "mongoose";
import {
  ticket,
  ticketDocument,
  ticketModelInterface,
} from "../interfaces/ticket.interface";

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
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

ticketSchema.statics.build = (props: ticket) => {
  return new OrderModel(props);
};

const OrderModel = model<ticketDocument, ticketModelInterface>(
  "Order",
  ticketSchema
);
