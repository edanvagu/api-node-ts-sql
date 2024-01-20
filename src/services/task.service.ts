import { pool } from "../database/database";
import { QueryResult } from "pg";
import { isBefore, isAfter } from "date-fns";
import { getProjectById } from "./project.service";

const getTaskById = async (id: number) => {
  const response: QueryResult = await pool.query(
    "SELECT * FROM tasks WHERE id_task = $1",
    [id]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const getAllTasks = async () => {
  const response: QueryResult = await pool.query(
    "SELECT * FROM tasks ORDER BY id_task ASC"
  );
  return response.rows;
};

const createTask = async (
  name: string,
  description: string,
  due_date: string,
  id_project: number
) => {
  const project = await getProjectById(id_project);

  if (project === null) {
    throw new Error("Project does not exist");
  }

  const dueDate = new Date(due_date);
  const startDate = new Date(project.start_date);
  const endDate = project.end_date;

  if (isBefore(dueDate, startDate) || (endDate && isAfter(dueDate, endDate))) {
    throw new Error(
      "Due date must be between the project start and end date (if exist)"
    );
  }

  const response: QueryResult = await pool.query(
    "INSERT INTO tasks (name_task, description_task, due_date, id_project) VALUES ($1, $2, $3, $4)",
    [
      name,
      description,
      dueDate ? dueDate.toISOString().split("T")[0] : null,
      id_project,
    ]
  );
  return response;
};

const editTask = async (
  id: number,
  name: string,
  description: string,
  due_date: string
) => {
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name_task = $" + (values.length + 1));
    values.push(name);
  }
  if (description !== undefined) {
    updates.push("description_task = $" + (values.length + 1));
    values.push(description);
  }
  if (due_date !== undefined) {
    const dueDate = new Date(due_date);

    const project = await getProjectByTaskId(id);
    const startDate = new Date(project.start_date);
    const endDate = project.end_date ? new Date(project.end_date) : null;

    if (
      isBefore(dueDate, startDate) ||
      (endDate && isAfter(dueDate, endDate))
    ) {
      throw new Error(
        "Due date must be between the project start and end date (if exist)"
      );
    }

    updates.push("due_date = $" + (values.length + 1));
    values.push(due_date);
  }
  values.push(id);

  const query = `UPDATE tasks SET ${updates.join(", ")} WHERE id_task = $${
    values.length
  } RETURNING *`;

  const response: QueryResult = await pool.query(query, values);

  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const deleteTask = async (id: number) => {
  const response: QueryResult = await pool.query(
    "DELETE FROM tasks WHERE id_task = $1 RETURNING *",
    [id]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const completeTask = async (id: number) => {
  const response: QueryResult = await pool.query(
    "UPDATE tasks SET status = 'COMPLETED' WHERE id_task = $1 RETURNING *",
    [id]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const getProjectByTaskId = async (taskId: number) => {
  const query = `SELECT projects.start_date, projects.end_date
                 FROM projects
                 INNER JOIN tasks ON tasks.id_project = projects.id_project
                 WHERE tasks.id_task = $1`;

  const response: QueryResult = await pool.query(query, [taskId]);

  if (response.rowCount === 0) {
    throw new Error("Task not found");
  }
  return response.rows[0];
};

export {
  getTaskById,
  getAllTasks,
  createTask,
  editTask,
  deleteTask,
  completeTask,
};
