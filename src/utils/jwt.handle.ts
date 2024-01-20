import { sign, verify } from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const signPromise = (id: string, change_password: boolean) => {
  const jwt = sign({ id, change_password }, JWT_SECRET, { expiresIn: "2h" });
  return jwt;
};

const verifyPromise = (token: string) => {
  const decoded = verify(token, JWT_SECRET);
  return decoded;
};

export { signPromise, verifyPromise };
