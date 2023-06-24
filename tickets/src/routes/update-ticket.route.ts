import { Router } from "express";
import ticketModel from "../models/ticket.model";
import { privateRoute } from "@sh-tickets/common";
import { natsWrapper } from "../nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

const router = Router();

router.put("/api/tickets/update/:id", privateRoute, async (req, res) => {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(401).send({
      message: "Invalid ticket id",
      data: null,
      error: true,
    });
  }

  const ticket = await ticketModel.findById(req.params.id);
  if (!ticket) {
    return res.status(404).send({
      message: "Ticket not found",
      data: null,
      error: true,
    });
  } else {
    if (ticket.userId !== req.user!.id) {
      return res.status(401).send({
        message: "Unauthorized",
        data: null,
        error: true,
      });
    } else {
      const { title, price } = req.body;

      ticket.set({
        title: title || ticket.title,
        price: price || ticket.price,
      });
      await ticket.save();
      new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      });
      return res.status(200).send({
        message: "Ticket updated",
        data: ticket,
        error: false,
      });
    }
  }
});

export default router;
