import { Pool } from "pg";

const database = process.env.DB_DATABASE || "";
const username = process.env.DB_USERNAME || "";
const password = process.env.DB_PASSWORD || "";
const host = process.env.DB_HOST || "";

const pool = new Pool({
  host,
  user: username,
  password,
  database,
});

async function db(): Promise<void> {
  try {
    await pool.connect();
    console.log("Connection has been established successfully.");
  } catch (e) {
    console.error("Unable to connect to the database:", e);
  }
}

export { db, pool };
