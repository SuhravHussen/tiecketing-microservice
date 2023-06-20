import mongoose from "mongoose";
import { HttpException } from "@sh-tickets/common";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

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

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // listen to ticket created and updated events
    // so that we can save the ticket in our db

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongodb from orders");

    //listen to port
    app.listen(3000, () => {
      console.log("Listening on port 3000!!!!!!!! from orders");
    });
  } catch (err) {
    console.log(err);
    throw new HttpException(500, "Internal Server Error");
  }
};

start();
