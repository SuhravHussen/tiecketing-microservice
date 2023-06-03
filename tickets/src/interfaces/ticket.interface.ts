import { Document, Model } from "mongoose";

export interface Ticket {
  title: string;
  price: number;
  userId: string;
}

export interface TicketDocument extends Ticket, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketModelInterface extends Model<TicketDocument> {
  build(props: Ticket): TicketDocument;
}