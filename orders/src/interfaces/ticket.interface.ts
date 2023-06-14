import { Document, Model } from "mongoose";

// an interface that describes the properties
// that are required to create a new user
export interface ticket {
  title: string;
  price: number;
}

// an interface that describes the properties
// that a user document has
export interface ticketDocument extends ticket, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// an interface that describes the properties
// that a user model has
export interface ticketModelInterface extends Model<ticketDocument> {
  build(props: ticket): ticketDocument;
}
