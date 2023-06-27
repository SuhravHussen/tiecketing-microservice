import { Document, Model } from "mongoose";

export interface Ticket {
  title: string;
  price: number;
  userId: string;
}

export interface TicketDocument extends Ticket, Document {
  id: string;
  version: number;
  createdAt: Date;
  updatedAt: Date;
  orderId?: string;
}

export interface TicketModelInterface extends Model<TicketDocument> {
  build(props: Ticket): TicketDocument;
}
