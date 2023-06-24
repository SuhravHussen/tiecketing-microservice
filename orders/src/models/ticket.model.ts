import { Schema, model } from "mongoose";
import {
  ticket,
  ticketDocument,
  ticketModelInterface,
} from "../interfaces/ticket.interface";
import { OrderModel } from "./order.model";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
const ticketSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
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
      transform(_, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (props: ticket) => {
  return new ticketModel(props);
};

ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await OrderModel.findOne({
    ticket: this.id,
    status: {
      $in: ["created", "awaiting:payment", "complete"],
    },
  });
  return !!existingOrder;
};

ticketSchema.statics.findByEvent = async (event: {
  id: string;
  version: number;
}) => {
  return await ticketModel.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

const ticketModel = model<ticketDocument, ticketModelInterface>(
  "ticket",
  ticketSchema
);

export { ticketModel };
