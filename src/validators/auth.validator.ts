import { body } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validatorHandler } from "../utils/validator.handle";

const loginValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const passwordValidator = [
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]+$/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter and one number"
    ),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

export { loginValidator, passwordValidator };
