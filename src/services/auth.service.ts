import { pool } from "../database/database";
import { QueryResult } from "pg";
import { verify } from "../utils/bcrypt.handle";
import { signPromise } from "../utils/jwt.handle";
import { encrypt } from "../utils/bcrypt.handle";

const login = async (username: string, password: string) => {
  const response: QueryResult = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (response.rowCount === 0) {
    return null;
  }
  const user = response.rows[0];
  
  if (!user.is_active) {
    throw new Error("User is not active");
  }
  
  const passwordEncrypted = user.password;
  const isValid = await verify(password, passwordEncrypted);
  if (!isValid) {
    throw new Error("Invalid password");
  }

  const token = await signPromise(user.id_user, user.change_password);

  const data = {
    id: user.id_user,
    username: user.username,
    token: token,
    change_password: user.change_password,
  };

  return data;
};

const changePassword = async (id: string, newPassword: string) => {
  const passwordEncrypted = await encrypt(newPassword);
  await pool.query("UPDATE users SET password = $1, change_password = false WHERE id_user = $2", [
    passwordEncrypted,
    id,
  ]);
}

export { login, changePassword };
