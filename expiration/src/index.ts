import { HttpException } from "@sh-tickets/common";
import { natsWrapper } from "./nats-wrapper";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

//mongodb
const start = async () => {
  console.log("Starting up expiration service...");

  try {
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
    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.log(err);
    throw new HttpException(500, "Internal Server Error");
  }
};

start();
