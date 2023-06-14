import { orderStatus } from "@sh-tickets/common";
import { Document, Model } from "mongoose";
import { ticketDocument } from "./ticket.interface";

// an interface that describes the properties
// that are required to create a new user
export interface order {
  userId: string;
  status: orderStatus;
  expiresAt: Date;
  ticket: ticketDocument;
}

// an interface that describes the properties
// that a user document has
export interface orderDocument extends order, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// an interface that describes the properties
// that a user model has
export interface orderModelInterface extends Model<orderDocument> {
  build(props: order): orderDocument;
}
