import { Response } from "express";

const handdleError = (res: Response, error: Error) => {
  return res.status(500).json({ error: error.message });
};

export { handdleError };