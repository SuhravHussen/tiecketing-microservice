import { hashPassword } from "./../utils/passwordHash";
import { NextFunction } from "express";
import { model, Schema } from "mongoose";
import { compare } from "bcrypt";
import {
  UserDocument,
  User,
  userModelInterface,
} from "../interface/user.interface";

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<UserDocument>("save", function (next: NextFunction) {
  const user = this;

  if (this.isModified("password") || (this.isNew && this.password)) {
    hashPassword(user.password as string)
      .then((hashedPassword) => {
        user.password = hashedPassword;
        next();
      })
      .catch((err) => {
        next(err);
      });
  } else {
    return next();
  }
});

// we must define before the model because the model is going to use this static method
userSchema.statics.build = function (props: User) {
  return new userModel(props);
};

userSchema.methods.comparePassword = function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as User;
  const { password } = user;
  return new Promise((resolve, reject) => {
    compare(candidatePassword, password as string, (err, success) => {
      if (err) return reject(err);
      return resolve(success);
    });
  });
};

// the first generic type is the type of the document the model is going to return when we query it or save it
// the second generic type is the type of the model itself (the model class)
const userModel = model<UserDocument, userModelInterface>("User", userSchema);

export default userModel;
