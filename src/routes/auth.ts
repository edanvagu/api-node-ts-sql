import { Router } from "express";
import {
  loginController,
  changePasswordController,
} from "../controllers/auth.controller";
import { sessionMiddleware } from "../middlewares/session.middleware";
import {
  passwordValidator,
  loginValidator,
} from "../validators/auth.validator";

const router = Router();

router.post("/login", loginValidator, loginController);
router.post(
  "/change-password",
  sessionMiddleware("operador"),
  passwordValidator,
  changePasswordController
);

export { router };
