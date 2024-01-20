import { body, param } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { validatorHandler } from "../utils/validator.handle";

const taskIdValidator = [
  param("id")
    .exists()
    .withMessage("ID is required")
    .isNumeric()
    .withMessage("ID must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const createTaskValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("due_date")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Invalid date format"),
  body("id_project")
    .notEmpty()
    .withMessage("Project ID is required")
    .isNumeric()
    .withMessage("Project ID must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const editTaskValidator = [
  body("name").optional().isString().withMessage("Name must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("due_date").optional().isISO8601().withMessage("Invalid date format"),
  (req: Request, res: Response, next: NextFunction) => {
    validatorHandler(req, res, next);
  },
];

const deleteTaskValidator = taskIdValidator;

const completeTaskValidator = taskIdValidator;

const getTaskByIdValidator = taskIdValidator;

export {
  taskIdValidator,
  createTaskValidator,
  editTaskValidator,
  deleteTaskValidator,
  completeTaskValidator,
  getTaskByIdValidator,
};
