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

const validateEmailAndPassword = [
  body("email").isEmail().withMessage("Please provide a valid email address."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  (req, res, next) => {
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

export default validateEmailAndPassword;
