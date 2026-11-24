import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';

const { ADMIN_USERNAME: username, ADMIN_EMAIL: email, ADMIN_PASSWORD: password } = process.env;

if (!username || !email || !password) {
  throw new Error('Set ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD in backend/.env before creating an admin.');
}
if (password.length < 12 || password.length > 128) {
  throw new Error('ADMIN_PASSWORD must be between 12 and 128 characters.');
}

try {
  const passwordHash = await bcrypt.hash(password, 12);
  await pool.execute(
    'INSERT INTO admins (username, email, password_hash) VALUES (?, ?, ?)',
    [username.trim(), email.trim(), passwordHash]
  );
  console.log(`Administrator "${username}" created. The password was not printed.`);
} finally {
  await pool.end();
}
