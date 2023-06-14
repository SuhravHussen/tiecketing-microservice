import { privateRoute } from "@sh-tickets/common";
import { Router } from "express";
import { validateOrder } from "../middlewares/validate-order.middleware";

const router = Router();

router.post("/api/orders/create", privateRoute, validateOrder, (req, res) => {
  res.send({});
});

export { router as createOrdersRoute };
