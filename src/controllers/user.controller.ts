import { Request, Response } from "express";
import { handdleError } from "../utils/error.handle";
import {
  getUserById,
  getAllUsers,
  createOperator,
  enableOperator,
  disableOperator,
  createAdmin,
} from "../services/user.service";

const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await getUserById(id);
    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    if (users.length === 0) {
      return res.status(200).json({ message: "There are not users" });
    }
    res.status(200).json({ users });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const createOperatorController = async (req: Request, res: Response) => {
  try {
    const { username } = req.body;
    const user = await createOperator(username);
    res.status(200).json({
      message: "Operator created successfully",
      body: {
        operator: {
          username,
          tempPassword: user.tempPassword,
        },
      },
    });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const enableOperatorController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await enableOperator(id);
    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Operator enabled successfully", body: { id } });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const disableOperatorController = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await disableOperator(id);
    if (user === null) {
      return res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "Operator disabled successfully", body: { id } });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const createAdminController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await createAdmin(username, password);
    res.status(200).json({
      message: "Admin created successfully",
      body: {
        admin: {
          username,
        },
      },
    });
  } catch (e: any) {
    handdleError(res, e);
  }
};

export {
  getUserByIdController,
  getAllUsersController,
  createOperatorController,
  enableOperatorController,
  disableOperatorController,
  createAdminController,
};
