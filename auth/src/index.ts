import mongoose from "mongoose";
import { HttpException } from "@sh-tickets/common";
import app from "./app";

//mongodb
const start = async () => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new HttpException(500, "JWT_SECRET must be defined");
    }

    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    console.log("Connected to mongodb");

    //listen to port
    app.listen(3000, () => {
      console.log("Listening on port 3000!!!!!!!!");
    });
  } catch (err) {
    console.log(err);
    throw new HttpException(500, "Internal Server Error");
  }
};

start();
