import { pool } from '../config/database.js';

export async function listProjects() {
  const [rows] = await pool.execute(
    'SELECT id, title, description, image, technologies, live_url, github_url, created_at FROM projects ORDER BY created_at DESC'
  );
  return rows;
}

export async function createProject(values) {
  const [result] = await pool.execute(
    'INSERT INTO projects (title, description, image, technologies, live_url, github_url) VALUES (?, ?, ?, ?, ?, ?)',
    values
  );
  return result.insertId;
}

export async function updateProject(id, values) {
  const [result] = await pool.execute(
    `UPDATE projects SET title = ?, description = ?, image = COALESCE(?, image),
     technologies = ?, live_url = ?, github_url = ? WHERE id = ?`,
    [...values, id]
  );
  return result.affectedRows > 0;
}

export async function findProject(id) {
  const [rows] = await pool.execute('SELECT image FROM projects WHERE id = ?', [id]);
  return rows[0] ?? null;
}

export async function deleteProject(id) {
  const [result] = await pool.execute('DELETE FROM projects WHERE id = ?', [id]);
  return result.affectedRows > 0;
}
