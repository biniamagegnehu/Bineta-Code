import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';

export async function changePassword(req, res) {
  const [admins] = await pool.execute('SELECT password_hash FROM admins WHERE id = ?', [req.admin.sub]);
  if (!admins.length || !(await bcrypt.compare(req.body.current_password, admins[0].password_hash))) {
    return res.status(400).json({ error: 'The current password is incorrect.' });
  }

  const passwordHash = await bcrypt.hash(req.body.new_password, 12);
  await pool.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [passwordHash, req.admin.sub]);
  return res.json({ message: 'Password changed. Sign in again with your new password.' });
}
