import { orderStatus } from "@sh-tickets/common";
import mongoose, { Document, Model } from "mongoose";

// an interface that describes the properties
// that are required to create a new user
export interface order {
  userId: string;
  status: orderStatus;
  expiresAt: Date;
  ticket: mongoose.Types.ObjectId;
}

// an interface that describes the properties
// that a user document has
export interface orderDocument extends order, Document {
  id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// an interface that describes the properties
// that a user model has
export interface orderModelInterface extends Model<orderDocument> {
  build(props: order): orderDocument;
}
