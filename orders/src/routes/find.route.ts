import { HttpException, privateRoute } from "@sh-tickets/common";
import { Request, Router } from "express";
import { OrderModel } from "../models/order.model";

const router = Router();

router.get("/api/orders/all", privateRoute, async (req: Request, res, next) => {
  try {
    const orders = await OrderModel.find({ userId: req.user!.id }).populate(
      "ticket"
    );
    if (!orders.length) {
      throw new HttpException(404, "No orders found");
    }
    res.send({
      message: "Orders found",
      data: orders,
      error: false,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/api/orders/:id", privateRoute, (req, res) => {
  res.send({});
});

export { router as findOrdersRoute };
