import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError, Result } from "express-validator";

interface CustomError extends Error {
  status?: number;
  errors?: Result<ValidationError>;
}

type ErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => Response<any> | void;

const errorHandler: ErrorHandler = (err, req, res: Response, next) => {
  const messages: string[] = [];
  if (err.errors) {
    // If the error is from Express Validator, return a 400 Bad Request status
    err.errors.array().forEach((error: ValidationError) => {
      messages.push(error.msg);
    });
  } else {
    // If the error is from our custom error handler, return the status code and message
    messages.push(err.message);
  }

  res.status(err.status || 400).json({ error: true, messages, data: null });
};

export default errorHandler;
