import mongoose, { Schema } from "mongoose";
import { Order, OrderDoc, OrderModel } from "../interface/order.interface";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
const orderSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: Order) => {
  return new orderModel(attrs);
};

const orderModel = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { orderModel };
