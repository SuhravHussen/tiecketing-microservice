import { HttpException, orderStatus, privateRoute } from "@sh-tickets/common";
import { Router } from "express";
import { OrderModel } from "../models/order.model";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled.publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.patch("/api/orders/cancel/:id", privateRoute, async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    if (order.userId !== req.user!.id) {
      throw new HttpException(401, "Order doesn't belong to you");
    }
    order.status = orderStatus.cancelled;
    await order.save();
    // checking to see if the ticket has a price to ignore ts error
    if ("price" in order.ticket) {
      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id.toString(),
        ticket: {
          id: order.ticket.id.toString(),
          price: order.ticket.price,
        },
        version: order.version,
      });
    }
    res.send({
      message: "Order cancelled",
      data: order,
      error: false,
    });
  } catch (err) {
    next(err);
  }
});

export { router as cancelOrderRouter };
