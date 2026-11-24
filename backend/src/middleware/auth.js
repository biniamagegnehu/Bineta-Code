import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export function requireAdmin(req, res, next) {
  const authorization = req.get('authorization');
  const token = authorization?.startsWith('Bearer ') ? authorization.slice(7) : '';

  if (!token) {
    return res.status(401).json({ error: 'Administrator sign-in is required.' });
  }

  try {
    req.admin = jwt.verify(token, config.jwtSecret);
    return next();
  } catch {
    return res.status(401).json({ error: 'Your session is invalid or has expired. Please sign in again.' });
  }
}
