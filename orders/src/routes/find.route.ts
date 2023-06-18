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

router.get("/api/orders/", privateRoute, async (req, res, next) => {
  try {
    const order = await OrderModel.find({
      userId: req.user!.id,
    }).populate("ticket");
    if (!order.length) {
      throw new HttpException(404, "Order not found");
    }
    res.send({
      message: "Order found",
      data: order,
      error: false,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/api/orders/:id", privateRoute, async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id).populate("ticket");
    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    if (order.userId !== req.user!.id) {
      throw new HttpException(401, "Order doesn't belong to you");
    }
    res.send({
      message: "Order found",
      data: order,
      error: false,
    });
  } catch (err) {
    next(err);
  }
});

export { router as findOrdersRoute };
