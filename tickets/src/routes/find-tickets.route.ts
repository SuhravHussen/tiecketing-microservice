import { Router } from "express";
import ticketModel from "../models/ticket.model";
import { privateRoute } from "@sh-tickets/common";

const router = Router();

router.get("/api/tickets/all", async (req, res) => {
  const tickets = await ticketModel.find({
    $or: [
      { orderId: null },
      { orderId: { $exists: false } }, // Check for undefined as well
    ],
  });
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

router.get("/api/tickets/userticket", privateRoute, async (req, res) => {
  const tickets = await ticketModel.find({
    userId: req.user!.id,
  });

  if (!tickets.length) {
    return res.status(404).send({
      message: "Tickets not found",
      data: null,
      error: false,
    });
  } else {
    return res.status(200).send({
      message: "Tickets found ",
      data: tickets,
      error: false,
    });
  }
});

router.get("/api/tickets/:id", privateRoute, async (req, res) => {
  try {
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
  } catch (err) {
    return res.status(500).send({
      message: err.message || "Internal Server Error",
      data: null,
      error: true,
    });
  }
});

export default router;
