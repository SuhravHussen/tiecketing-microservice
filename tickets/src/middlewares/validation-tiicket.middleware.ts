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

const validateTicket = [
  body("title")
    .exists()
    .withMessage("Title is required")
    .isString()
    .withMessage("Title must be a string")
    .isLength({ min: 3, max: 20 })
    .withMessage("Title must be between 3 and 20 characters"),

  body("price")
    .exists()
    .withMessage("Price is required")
    .isNumeric()
    .withMessage("Price must be a number")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than 0"),

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

export default validateTicket;
