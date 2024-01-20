import { Router } from "express";
import {
  getTaskByIdController,
  getAllTasksController,
  createTaskController,
  editTaskController,
  deleteTaskController,
  completeTaskController,
} from "../controllers/task.controller";
import { sessionMiddleware } from "../middlewares/session.middleware";
import {
  taskIdValidator,
  createTaskValidator,
  editTaskValidator,
  deleteTaskValidator,
  completeTaskValidator,
  getTaskByIdValidator,
} from "../validators/task.validator";

const router = Router();

router.get("/", sessionMiddleware("administrador"), getAllTasksController);
router.get(
  "/:id",
  sessionMiddleware("administrador"),
  getTaskByIdValidator,
  getTaskByIdController
);
router.post(
  "/",
  sessionMiddleware("operador"),
  createTaskValidator,
  createTaskController
);
router.put(
  "/:id",
  sessionMiddleware("operador"),
  taskIdValidator,
  editTaskValidator,
  editTaskController
);
router.delete(
  "/:id",
  sessionMiddleware("operador"),
  deleteTaskValidator,
  deleteTaskController
);
router.patch(
  "/:id/complete",
  sessionMiddleware("operador"),
  completeTaskValidator,
  completeTaskController
);

export { router };
