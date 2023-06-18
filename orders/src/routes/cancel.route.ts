import { HttpException, orderStatus, privateRoute } from "@sh-tickets/common";
import { Router } from "express";
import { OrderModel } from "../models/order.model";

const router = Router();

router.patch("/api/orders/cancel/:id", privateRoute, async (req, res, next) => {
  try {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
      throw new HttpException(404, "Order not found");
    }
    if (order.userId !== req.user!.id) {
      throw new HttpException(401, "Order doesn't belong to you");
    }
    order.status = orderStatus.cancelled;
    await order.save();
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
