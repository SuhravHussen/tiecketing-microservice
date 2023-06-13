import { HttpException } from "@sh-tickets/common";
import { Router, Request, Response } from "express";
import validateTicket from "../middlewares/validation-tiicket.middleware";
import ticketModel from "../models/ticket.model";
import { privateRoute } from "@sh-tickets/common";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

router.post(
  "/api/tickets",
  privateRoute,
  validateTicket,
  async (req: Request, res: Response) => {
    try {
      const ticket = ticketModel.build({
        title: req.body.title,
        price: req.body.price,
        userId: req.user!.id,
      });

      await ticket.save();

      await new TicketCreatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
      });

      res.status(201).send({
        message: "Ticket created successfully",
        data: ticket,
        error: false,
      });
    } catch (err) {
      throw new HttpException(500, err.message || "Internal server error");
    }
  }
);

export default router;
