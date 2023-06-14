import { privateRoute } from "@sh-tickets/common";
import { Router } from "express";

const router = Router();

router.get("/api/orders/all", privateRoute, (req, res) => {
  res.send({});
});

router.get("/api/orders/:id", privateRoute, (req, res) => {
  res.send({});
});

export { router as findOrdersRoute };
