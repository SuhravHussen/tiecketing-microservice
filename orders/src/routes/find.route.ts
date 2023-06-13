import { Router } from "express";

const router = Router();

router.get("/api/orders/all", (req, res) => {
  res.send({});
});

router.get("/api/orders/:id", (req, res) => {
  res.send({});
});

export { router as findOrdersRoute };
