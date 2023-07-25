import mongoose from "mongoose";
import { HttpException } from "@sh-tickets/common";
import app from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";
import { ExpirationCompleteListener } from "./events/listeners/expiration-complete-listener";
import { PaymentsSuccessListener } from "./events/listeners/payment-success-listener";

//mongodb
const start = async () => {
  console.log("Starting up orders service...");

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

    //connect to nats
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("NATS connection closed!");
      process.exit();
    });

    // listen to interupt signals like ctrl+c or docker stop
    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    // listen to ticket created and updated events
    // so that we can save the ticket in our db

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentsSuccessListener(natsWrapper.client).listen();
    //connect to mongodb
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
