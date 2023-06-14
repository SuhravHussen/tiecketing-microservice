import { privateRoute } from "@sh-tickets/common";
import { Router } from "express";

const router = Router();

router.delete("/api/orders/delete/:id", privateRoute, (req, res) => {
  res.send({});
});

export { router as deleteOrdersRoute };
