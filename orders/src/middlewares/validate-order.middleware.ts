import { NextFunction, Request, Response } from "express";
import {
  Result,
  ValidationError,
  body,
  validationResult,
} from "express-validator";
import mongoose from "mongoose";

interface CustomError extends Error {
  status?: number;
  errors?: Result<ValidationError>;
}

const validateOrder = [
  body("ticketId")
    .not()
    .isEmpty()
    .custom((i: string) => mongoose.Types.ObjectId.isValid(i))
    .withMessage("TicketId must be provided and valid"),
  (req: any, res: any, next: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation error") as CustomError;
      error.status = 400;
      error.errors = errors;

      return next(error);
    }
    next();
  },
];

export { validateOrder };
