import { Request, Response } from "express";
import { handdleError } from "../utils/error.handle";
import {
  getProjectById,
  getAllProjects,
  createProject,
  editProject,
  deleteProject,
  completeProject,
} from "../services/project.service";

const getProjectByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const project = await getProjectById(id);
    if (project === null) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ project });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const getAllProjectsController = async (req: Request, res: Response) => {
  try {
    const projects = await getAllProjects();
    if (projects.length === 0) {
      return res.status(200).json({ message: "There are not projects" });
    }
    res.status(200).json({ projects });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const createProjectController = async (req: Request, res: Response) => {
  try {
    const { name, description, start_date, end_date } = req.body;
    await createProject(name, description, start_date, end_date);
    res.status(200).json({
      message: "Project created successfully",
      body: {
        project: {
          name,
          description,
          start_date,
          end_date,
        },
      },
    });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const editProjectController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name, description, end_date } = req.body;
    const project = await editProject(id, name, description, end_date);
    if (project === null) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({
      message: "Project updated successfully",
      body: {
        project: {
          name,
          description,
          end_date,
        },
      },
    });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const deleteProjectController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const project = await deleteProject(id);
    if (project === null) {
      return res.status(404).json({ message: "Project not found" });
    }
    res
      .status(200)
      .json({ message: "Project deleted successfully", body: { id } });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const completeProjectController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const project = await completeProject(id);
    if (project === null) {
      return res.status(404).json({ message: "Project not found" });
    }
    res
      .status(200)
      .json({ message: "Project marked as completed", body: { id } });
  } catch (e: any) {
    handdleError(res, e);
  }
};

export {
  getProjectByIdController,
  getAllProjectsController,
  createProjectController,
  editProjectController,
  deleteProjectController,
  completeProjectController,
};
