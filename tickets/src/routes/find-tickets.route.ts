import { Router } from "express";
import ticketModel from "../models/ticket.model";
import { privateRoute } from "@sh-tickets/common";

const router = Router();

router.get("/api/tickets/all", async (req, res) => {
  const tickets = await ticketModel.find({});
  if (!tickets.length) {
    return res.status(404).send({
      message: "Tickets not found",
      data: null,
      error: true,
    });
  }
  return res.status(200).send({
    message: "Tickets found",
    data: tickets,
    error: false,
  });
});

router.get("/api/tickets/:id", privateRoute, async (req, res) => {
  const ticket = await ticketModel.findById(req.params.id);
  if (!ticket) {
    return res.status(404).send({
      message: "Ticket not found",
      data: null,
      error: true,
    });
  } else {
    return res.status(200).send({
      message: "Ticket found",
      data: ticket,
      error: false,
    });
  }
});

export default router;
