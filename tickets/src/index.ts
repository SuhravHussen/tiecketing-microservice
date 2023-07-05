import mongoose from "mongoose";
import { HttpException } from "@sh-tickets/common";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

//mongodb
const start = async () => {
  try {
    if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
      throw new HttpException(500, "env must be defined");
    }

    if (!process.env.NATS_CLIENT_ID) {
      throw new HttpException(500, "NATS_CLIENT_ID must be defined");
    }

    if (!process.env.NATS_URL) {
      throw new HttpException(500, "NATS_URL must be defined");
    }

    if (!process.env.NATS_CLUSTER_ID) {
      throw new HttpException(500, "NATS_CLUSTER_ID must be defined");
    }

    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb");

    //listen to port
    app.listen(3000, () => {
      console.log("Listening on port 3000!!!!!!!! from tickets");
    });
  } catch (err) {
    console.log(err);
    throw new HttpException(500, "Internal Server Error");
  }
};

start();
