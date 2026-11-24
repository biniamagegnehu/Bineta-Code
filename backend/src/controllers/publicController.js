import { body } from 'express-validator';
import { pool } from '../config/database.js';
import { listProjects } from '../models/projectModel.js';

export async function getProfile(req, res) {
  const [rows] = await pool.execute(
    'SELECT full_name, headline, biography, profile_image, email, social_links FROM profile WHERE id = 1'
  );
  return res.json(rows[0] || null);
}

export async function getProjects(req, res) {
  return res.json(await listProjects());
}

export const contactValidation = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').isLength({ max: 254 }),
  body('subject').trim().isLength({ min: 2, max: 180 }).withMessage('Subject must be between 2 and 180 characters.'),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be between 10 and 5,000 characters.')
];

export async function submitContact(req, res) {
  const { name, email, subject, message } = req.body;
  const [result] = await pool.execute(
    'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name.trim(), email.trim(), subject.trim(), message.trim()]
  );
  return res.status(201).json({ id: result.insertId, message: 'Your message has been sent successfully.' });
}
