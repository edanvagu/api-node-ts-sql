import { Router } from "express";
import {
  getUserByIdController,
  getAllUsersController,
  createOperatorController,
  enableOperatorController,
  disableOperatorController,
} from "../controllers/user.controller";
import { sessionMiddleware } from "../middlewares/session.middleware";
import {
  createOperatorValidator,
  enableOperatorValidator,
  disableOperatorValidator,
  userIdValidator,
  getUserByIdValidator,
} from "../validators/user.validator";

const router = Router();

router.get("/", sessionMiddleware("administrador"), getAllUsersController);
router.get(
  "/:id",
  sessionMiddleware("administrador"),
  getUserByIdValidator,
  getUserByIdController
);
router.post(
  "/",
  sessionMiddleware("administrador"),
  createOperatorValidator,
  createOperatorController
);
router.patch(
  "/:id/enable",
  sessionMiddleware("administrador"),
  enableOperatorValidator,
  enableOperatorController
);
router.patch(
  "/:id/disable",
  sessionMiddleware("administrador"),
  disableOperatorValidator,
  disableOperatorController
);

export { router };
