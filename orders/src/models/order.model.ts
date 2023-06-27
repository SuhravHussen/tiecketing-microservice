import { Schema, model } from "mongoose";
import {
  order,
  orderDocument,
  orderModelInterface,
} from "../interfaces/order.interface";
import { orderStatus } from "@sh-tickets/common";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
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
      ref: "ticket",
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (props: order) => {
  return new OrderModel(props);
};

const OrderModel = model<orderDocument, orderModelInterface>(
  "order",
  orderSchema
);

export { OrderModel };
