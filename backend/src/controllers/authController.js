import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { pool } from '../config/database.js';
import { config } from '../config/env.js';

export const loginValidation = [
  body('username').trim().notEmpty().withMessage('Enter your username.').isLength({ max: 60 }),
  body('password').isString().notEmpty().withMessage('Enter your password.')
];

const dummyPasswordHash = '$2a$10$XBW4.YeAO7mDEbTIYoYOUepeNnac9j5SYiX7uuNMmOlhw6yIi.jmC';

export async function login(req, res) {
  const [admins] = await pool.execute(
    'SELECT id, username, email, password_hash FROM admins WHERE username = ? OR email = ? LIMIT 1',
    [req.body.username.trim(), req.body.username.trim()]
  );
  const admin = admins[0];
  const validPassword = admin
    ? await bcrypt.compare(req.body.password, admin.password_hash)
    : await bcrypt.compare(req.body.password, dummyPasswordHash);

  if (!admin || !validPassword) {
    return res.status(401).json({ error: 'The username or password is incorrect.' });
  }

  const token = jwt.sign({ sub: admin.id, username: admin.username }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
  return res.json({ token, admin: { id: admin.id, username: admin.username, email: admin.email } });
}
