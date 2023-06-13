import { Router } from "express";

const router = Router();

router.post("/api/orders/create", (req, res) => {
  res.send({});
});

export { router as createOrdersRoute };
