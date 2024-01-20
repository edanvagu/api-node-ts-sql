import { body, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validatorHandler } from "../utils/validator.handle";

const projectIdValidator = [
  param("id")
    .exists()
    .withMessage("ID is required")
    .isNumeric()
    .withMessage("ID must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const createProjectValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("start_date")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date (YYYY-MM-DD)"),
  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD)"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const editProjectValidator = [
  body("name").optional(),
  body("description").optional(),
  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date (YYYY-MM-DD)"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const deleteProjectValidator = projectIdValidator;

const getProjectByIdValidator = projectIdValidator;

const completeProjectValidator = projectIdValidator;

export {
  createProjectValidator,
  editProjectValidator,
  deleteProjectValidator,
  getProjectByIdValidator,
  completeProjectValidator,
  projectIdValidator,
};
