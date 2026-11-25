
import mysql from 'mysql2/promise';
import { readFileSync } from 'node:fs';
import { config } from './env.js';

export const pool = mysql.createPool({
  ...config.database,
  ssl: {
    ca: readFileSync(new URL('../../isrgrootx1.pem', import.meta.url), 'utf8')
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});
