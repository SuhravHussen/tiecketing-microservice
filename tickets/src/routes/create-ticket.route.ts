import { privateRoute } from "@sh-tickets/common";
import { Router, Request, Response } from "express";

const router = Router();

router.post("/api/tickets", privateRoute, (req: Request, res: Response) => {
  res.send({ message: "Ticket created" });
});

export default router;
