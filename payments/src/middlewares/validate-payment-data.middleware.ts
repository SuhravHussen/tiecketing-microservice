import {
  Result,
  ValidationError,
  body,
  validationResult,
} from "express-validator";

interface CustomError extends Error {
  status?: number;
  errors?: Result<ValidationError>;
}

const validatePaymentData = [
  body("token")
    .exists()
    .withMessage("Token is required")
    .isString()
    .withMessage("Token must be a string"),
  body("orderId")
    .exists()
    .withMessage("Order id is required")
    .isString()
    .withMessage("Order id must be a string"),

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

export default validatePaymentData;
