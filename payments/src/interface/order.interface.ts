import { orderStatus } from "@sh-tickets/common";
import { Document, Model } from "mongoose";

export interface Order {
  _id: string;
  version: number;
  userId: string;
  price: number;
  status: orderStatus;
}

export interface OrderDoc extends Document {
  version: number;
  userId: string;
  price: number;
  status: orderStatus;
  id: string;
}

export interface OrderModel extends Model<OrderDoc> {
  build(attrs: Order): OrderDoc;
}
