import { HttpException, orderStatus, privateRoute } from "@sh-tickets/common";
import { Response, Router } from "express";
import { validateOrder } from "../middlewares/validate-order.middleware";
import { ticketModel } from "../models/ticket.model";
import { OrderModel } from "../models/order.model";
import { MyCustomResponse } from "../interfaces/response.interface";

const router = Router();

declare global {
  namespace Express {
    interface Response {
      json(data: { message: string }): this;
    }
  }
}

router.post(
  "/api/orders/create",
  privateRoute,
  validateOrder,
  async (req, res: MyCustomResponse, next) => {
    try {
      // find the ticket the user is trying to order in the database
      const { ticketId } = req.body;
      const ticket = await ticketModel.findById(ticketId);

      if (!ticket) {
        throw new HttpException(404, "Ticket not found");
      }
      // make sure that this ticket is not already reserved

      const isReserved = await ticket.isReserved();
      console.log(isReserved);
      if (isReserved) {
        throw new HttpException(400, "Ticket is already reserved");
        return;
      }
      // calculate an expiration date for this order
      const expiration = new Date();
      expiration.setSeconds(expiration.getSeconds() + 15 * 60);

      // build the order and save it to the database
      const order = await OrderModel.build({
        userId: req.currentUser!.id,
        status: orderStatus.created,
        expiresAt: expiration,
        ticket: ticketId,
      });
      await order.save();

      // publish an event saying that an order was created

      res.json({
        message: "Order created successfully",
        data: order,
        error: false,
      });
    } catch (err) {
      next(err);
    }
  }
);

export { router as createOrdersRoute };
