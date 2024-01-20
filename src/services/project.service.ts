import { pool } from "../database/database";
import { QueryResult } from "pg";
import { isBefore, isSameDay, isAfter } from "date-fns";

const getProjectById = async (id: number) => {
  const response: QueryResult = await pool.query(
    "SELECT * FROM projects WHERE id_project = $1",
    [id]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const getAllProjects = async () => {
  const response: QueryResult = await pool.query(
    "SELECT * FROM projects ORDER BY id_project ASC"
  );
  return response.rows;
};

const createProject = async (
  name: string,
  description: string,
  start_date: string,
  end_date: string
) => {
  const startDate = new Date(start_date);
  const endDate = end_date ? new Date(end_date) : null;
  const currentDate = new Date();

  if (isBefore(startDate, currentDate) && !isSameDay(startDate, currentDate)) {
    throw new Error("Start date must be today or in the future");
  }
  if (
    endDate &&
    (isBefore(endDate, startDate) || isSameDay(endDate, startDate))
  ) {
    throw new Error("End date must be after start date");
  }

  const response: QueryResult = await pool.query(
    "INSERT INTO projects (name_project, description_project, start_date, end_date) VALUES ($1, $2, $3, $4)",
    [
      name,
      description,
      startDate.toISOString().split("T")[0],
      endDate ? endDate.toISOString().split("T")[0] : null,
    ]
  );
  return response;
};

const editProject = async (
  id: number,
  name: string,
  description: string,
  end_date: string
) => {
  const updates = [];
  const values = [];

  if (name !== undefined) {
    updates.push("name_project = $" + (values.length + 1));
    values.push(name);
  }
  if (description !== undefined) {
    updates.push("description_project = $" + (values.length + 1));
    values.push(description);
  }
  if (end_date !== undefined) {
    const endDate = new Date(end_date);

    const project = await pool.query(
      "SELECT start_date FROM projects WHERE id_project = $1",
      [id]
    );
    const startDate = new Date(project.rows[0].start_date);

    if (isBefore(endDate, startDate) || isSameDay(endDate, startDate)) {
      throw new Error("End date must be greater than the start date");
    }

    const task = await pool.query(
      "SELECT MAX(due_date) as latest_task_due_date FROM tasks WHERE id_project = $1",
      [id]
    );
    const latestTaskDueDate = new Date(task.rows[0].latest_task_due_date);

    if(task.rows[0].latest_task_due_date){
      if (isAfter(endDate, latestTaskDueDate)) {
        throw new Error(
          "End date must not be greater than the due date of any task"
        );
      }      
    }

    updates.push("end_date = $" + (values.length + 1));
    values.push(endDate.toISOString().split("T")[0]);
  }
  values.push(id);

  const query = `UPDATE projects SET ${updates.join(
    ", "
  )} WHERE id_project = $${values.length} RETURNING *`;

  const response: QueryResult = await pool.query(query, values);

  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const deleteProject = async (id: number) => {
  await pool.query("DELETE FROM tasks WHERE id_project = $1", [id]);

  const response: QueryResult = await pool.query(
    "DELETE FROM projects WHERE id_project = $1 RETURNING *",
    [id]
  );
  if (response.rowCount === 0) {
    return null;
  }
  return response.rows[0];
};

const completeProject = async (id: number) => {
  const tasks: QueryResult = await pool.query(
    "SELECT status FROM tasks WHERE id_project = $1",
    [id]
  );
  if (!tasks.rowCount) {
    throw new Error("Project does not exist or has no tasks");
  }

  for (let i = 0; i < tasks.rowCount; i++) {
    if (tasks.rows[i].status !== "COMPLETED") {
      throw new Error(
        "All tasks must be completed before the project can be completed"
      );
    }
  }

  const response: QueryResult = await pool.query(
    "UPDATE projects SET status = 'COMPLETED' WHERE id_project = $1 RETURNING *",
    [id]
  );
  return response.rows[0];
};

export {
  getProjectById,
  getAllProjects,
  createProject,
  editProject,
  deleteProject,
  completeProject,
};
