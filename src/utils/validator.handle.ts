import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validatorHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    validationResult(req).throw();
    next();
  } catch (e: any) {
    res.status(403).json({ errors: e.array() });
  }
};

export { validatorHandler };
