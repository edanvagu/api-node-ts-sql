import { Router } from "express";
import {
  getAllProjectsController,
  getProjectByIdController,
  createProjectController,
  editProjectController,
  deleteProjectController,
  completeProjectController,
} from "../controllers/project.controller";
import { sessionMiddleware } from "../middlewares/session.middleware";
import {
  projectIdValidator,
  createProjectValidator,
  editProjectValidator,
  deleteProjectValidator,
  getProjectByIdValidator,
  completeProjectValidator,
} from "../validators/project.validator";

const router = Router();

router.get("/", sessionMiddleware("administrador"), getAllProjectsController);
router.get(
  "/:id",
  sessionMiddleware("administrador"),
  getProjectByIdValidator,
  getProjectByIdController
);
router.post(
  "/",
  sessionMiddleware("operador"),
  createProjectValidator,
  createProjectController
);
router.put(
  "/:id",
  sessionMiddleware("operador"),
  projectIdValidator,
  editProjectValidator,
  editProjectController
);
router.delete(
  "/:id",
  sessionMiddleware("operador"),
  deleteProjectValidator,
  deleteProjectController
);
router.patch(
  "/:id/complete",
  sessionMiddleware("operador"),
  completeProjectValidator,
  completeProjectController
);

export { router };
