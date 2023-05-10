import { Document, Model } from "mongoose";

// an interface that describes the properties
// that are required to create a new user
export interface User {
  email: string;
  password?: string | null;
}

// an interface that describes the properties
// that a user document has
export interface UserDocument extends User, Document {
  _id: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

// an interface that describes the properties
// that a user model has
export interface userModelInterface extends Model<UserDocument> {
  build(props: User): UserDocument;
  compare(candidatePassword: string): Promise<boolean>;
}
