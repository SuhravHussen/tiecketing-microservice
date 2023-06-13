import { Router } from "express";

const router = Router();

router.delete("/api/orders/delete", (req, res) => {
  res.send({});
});

export { router as deleteOrdersRoute };
