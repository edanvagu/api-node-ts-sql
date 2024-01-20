import { body, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validatorHandler } from "../utils/validator.handle";

const userIdValidator = [
  param("id")
    .exists()
    .withMessage("ID is required")
    .isNumeric()
    .withMessage("ID must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const createOperatorValidator = [
  body("username").notEmpty().withMessage("Username is required"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const enableOperatorValidator = userIdValidator;

const disableOperatorValidator = userIdValidator;

const getUserByIdValidator = userIdValidator;

export {
  createOperatorValidator,
  enableOperatorValidator,
  disableOperatorValidator,
  userIdValidator,
  getUserByIdValidator,
};
