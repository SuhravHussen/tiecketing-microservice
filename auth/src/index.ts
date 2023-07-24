import mongoose from "mongoose";
import { HttpException } from "@sh-tickets/common";
import app from "./app";

//mongodb
const start = async () => {
  try {
    console.log("Starting up auth service...");
    if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
      throw new HttpException(500, " env must be defined");
    }

    await mongoose.connect(process.env.MONGO_URI);
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
