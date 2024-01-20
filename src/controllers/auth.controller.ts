import { Request, Response } from "express";
import { handdleError } from "../utils/error.handle";
import { login, changePassword } from "../services/auth.service";

const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const data = await login(username, password);
    if (data === null) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: data });
  } catch (e: any) {
    handdleError(res, e);
  }
};

const changePasswordController = async (req: Request, res: Response) => {
  try {
    const { newPassword } = req.body;
    const id = res.locals.user.id;
    await changePassword(id, newPassword);
    res.status(200).json({ message: "Password changed successfully" });
  } catch (e: any) {
    handdleError(res, e);
  }
};

export { loginController, changePasswordController };
