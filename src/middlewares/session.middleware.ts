import { Request, Response, NextFunction } from "express";
import { verifyPromise } from "../utils/jwt.handle";
import { pool } from "../database/database";
import { handdleError } from "../utils/error.handle";


const sessionMiddleware = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        return res.status(403).json({ message: "No token provided" });
      }

      const decoded: any = await verifyPromise(token);
      const user = await pool.query("SELECT * FROM users WHERE id_user = $1", [
        decoded.id,
      ]);

      if (user.rowCount === 0) {
        return res.status(403).json({ message: "User not found" });
      }

      if (user.rows[0].role !== requiredRole) {
        return res
          .status(403)
          .json({ message: `User is not a ${requiredRole}` });
      }

      res.locals.user = decoded;
      next();
    } catch (e: any) {
      handdleError(res, e);
    }
  };
};

export { sessionMiddleware };
