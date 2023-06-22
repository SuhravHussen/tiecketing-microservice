import { Schema, model } from "mongoose";
import {
  Ticket,
  TicketDocument,
  TicketModelInterface,
} from "../interfaces/ticket.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

const ticketSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    userId: {
      type: String,
      required: true,
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

ticketSchema.statics.build = function (props: Ticket) {
  return new ticketModel(props);
};

const ticketModel = model<TicketDocument, TicketModelInterface>(
  "Ticket",
  ticketSchema
);

export default ticketModel;
