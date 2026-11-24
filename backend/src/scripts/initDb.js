import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mysql from 'mysql2/promise';
import { config } from '../config/env.js';

const backendDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const sql = await fs.readFile(path.join(backendDir, 'database.sql'), 'utf8');
const connection = await mysql.createConnection({ ...config.database, multipleStatements: true });

try {
  await connection.query(sql);
  console.log(`Database schema is ready (${config.database.database}).`);
} finally {
  await connection.end();
}
