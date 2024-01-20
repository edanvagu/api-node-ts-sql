import { pool } from "../database/database";
import { QueryResult } from "pg";
import { encrypt } from "../utils/bcrypt.handle";
import { v4 as uuidv4 } from "uuid";

const getUserById = async (id: number) => {
  const response: QueryResult = await pool.query(
    "SELECT id_user, username, role, is_active, change_password FROM users WHERE id_user = $1",
    [id]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const getAllUsers = async () => {
  const response: QueryResult = await pool.query(
    "SELECT id_user, username, role, is_active, change_password FROM users ORDER BY id_user ASC"
  );
  return response.rows;
};

const createOperator = async (username: string) => {
  const existingUser: QueryResult = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (existingUser.rowCount) {
    throw new Error("Username already exists");
  }

  const tempPassword = uuidv4();
  const encryptedPassword = await encrypt(tempPassword);

  const response: QueryResult = await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
    [username, encryptedPassword]
  );
  return {
    user: response.rows[0],
    tempPassword,
  };
};

const enableOperator = async (id: number) => {
  const response: QueryResult = await pool.query(
    "UPDATE users SET is_active = 'true' WHERE id_user = $1 AND role = $2 RETURNING *",
    [id, "operador"]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const disableOperator = async (id: number) => {
  const response: QueryResult = await pool.query(
    "UPDATE users SET is_active = 'false' WHERE id_user = $1 AND role = $2 RETURNING *",
    [id, "operador"]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const createAdmin = async (username: string, password: string) => {
  const existingUser: QueryResult = await pool.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );
  if (existingUser.rowCount) {
    throw new Error("Username already exists");
  }

  const encryptedPassword = await encrypt(password);

  const response: QueryResult = await pool.query(
    "INSERT INTO users (username, password, role, change_password) VALUES ($1, $2, 'administrador', false) RETURNING *",
    [username, encryptedPassword]
  );
  return {
    user: response.rows[0],
  };
};

export {
  getUserById,
  getAllUsers,
  createOperator,
  enableOperator,
  disableOperator,
  createAdmin,
};
