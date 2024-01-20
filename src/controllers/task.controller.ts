import { Request, Response } from "express";
import { handdleError } from "../utils/error.handle";
import {
  getTaskById,
  getAllTasks,
  createTask,
  editTask,
  deleteTask,
  completeTask,
} from "../services/task.service";

const getTaskByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const task = await getTaskById(id);
    if (task === null) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const tasks = await getAllTasks();
    if (tasks.length === 0) {
      return res.status(200).json({ message: "There are not tasks" });
    }
    res.status(200).json({ tasks });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const createTaskController = async (req: Request, res: Response) => {
  try {
    const { name, description, due_date, id_project } = req.body;
    await createTask(name, description, due_date, id_project);
    res.status(200).json({
      message: "Task created successfully",
      body: {
        task: {
          name,
          description,
          due_date,
          id_project,
        },
      },
    });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const editTaskController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, due_date } = req.body;
    const task = await editTask(id, name, description, due_date);
    if (task === null) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task updated successfully",
      body: {
        task: {
          name,
          description,
          due_date,
        },
      },
    });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const task = await deleteTask(id);
    if (task === null) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task deleted successfully",
      body: {
        id,
      },
    });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const completeTaskController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const task = await completeTask(id);
    if (task === null) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({
      message: "Task completed successfully",
      body: {
        id,
      },
    });
  } catch (e: any) {
    handdleError(res, e);
  }
};

export {
  getTaskByIdController,
  getAllTasksController,
  createTaskController,
  editTaskController,
  deleteTaskController,
  completeTaskController,
};
