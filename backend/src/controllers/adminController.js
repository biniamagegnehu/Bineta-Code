import { body, param } from 'express-validator';
import { pool } from '../config/database.js';
import { removeUploadedFile } from '../middleware/upload.js';
import { createProject as createProjectRecord, deleteProject as deleteProjectRecord, findProject, updateProject as updateProjectRecord } from '../models/projectModel.js';

const projectRules = [
  body('title').trim().isLength({ min: 2, max: 120 }).withMessage('Project title must be between 2 and 120 characters.'),
  body('description').trim().isLength({ min: 10, max: 5000 }).withMessage('Description must be between 10 and 5,000 characters.'),
  body('technologies').custom((value) => {
    if (!Array.isArray(value) || value.length > 20 || value.some((item) => typeof item !== 'string' || item.trim().length > 40)) {
      throw new Error('Technologies must be a list of up to 20 short labels.');
    }
    return true;
  }),
  body('live_url').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Live URL must start with http:// or https://.'),
  body('github_url').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('GitHub URL must start with http:// or https://.')
];

export const createProjectValidation = projectRules;
export const updateProjectValidation = [
  param('id').isInt({ min: 1 }).withMessage('Invalid project ID.'),
  ...projectRules
];

export async function getOverview(req, res) {
  const [[projectCount]] = await pool.execute('SELECT COUNT(*) AS total FROM projects');
  const [[messageCounts]] = await pool.execute(
    "SELECT COUNT(*) AS total, SUM(status = 'unread') AS unread FROM contact_messages"
  );
  const [recentMessages] = await pool.execute(
    'SELECT id, name, email, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5'
  );
  const [monthlyRows] = await pool.execute(
    "SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS total FROM contact_messages WHERE created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 5 MONTH) GROUP BY DATE_FORMAT(created_at, '%Y-%m') ORDER BY month"
  );
  return res.json({
    projects: Number(projectCount.total),
    messages: Number(messageCounts.total),
    unread: Number(messageCounts.unread || 0),
    recentMessages,
    monthlyMessages: monthlyRows
  });
}

export async function getMessages(req, res) {
  const [rows] = await pool.execute(
    'SELECT id, name, email, subject, message, status, created_at FROM contact_messages ORDER BY created_at DESC'
  );
  return res.json(rows);
}

export async function setMessageStatus(req, res) {
  const [result] = await pool.execute(
    'UPDATE contact_messages SET status = ? WHERE id = ?',
    [req.body.status, Number(req.params.id)]
  );
  if (!result.affectedRows) return res.status(404).json({ error: 'Message not found.' });
  return res.json({ message: 'Message status updated.' });
}

export async function deleteMessage(req, res) {
  const [result] = await pool.execute('DELETE FROM contact_messages WHERE id = ?', [Number(req.params.id)]);
  if (!result.affectedRows) return res.status(404).json({ error: 'Message not found.' });
  return res.status(204).end();
}

export const messageIdValidation = [param('id').isInt({ min: 1 }).withMessage('Invalid message ID.')];
export const messageStatusValidation = [
  ...messageIdValidation,
  body('status').isIn(['read', 'unread']).withMessage('Status must be read or unread.')
];

function projectValues(body, image) {
  return [
    body.title.trim(),
    body.description.trim(),
    image,
    JSON.stringify(body.technologies.map((technology) => technology.trim()).filter(Boolean)),
    body.live_url?.trim() || null,
    body.github_url?.trim() || null
  ];
}

export async function createProject(req, res) {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const values = projectValues(req.body, image);
  const id = await createProjectRecord(values);
  return res.status(201).json({ id, message: 'Project created.' });
}

export async function updateProject(req, res) {
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  const values = projectValues(req.body, image);
  const updated = await updateProjectRecord(Number(req.params.id), values);
  if (!updated) {
    if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
    return res.status(404).json({ error: 'Project not found.' });
  }
  return res.json({ message: 'Project updated.' });
}

export async function deleteProject(req, res) {
  const id = Number(req.params.id);
  const project = await findProject(id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });
  await deleteProjectRecord(id);
  removeUploadedFile(project.image);
  return res.status(204).end();
}

export const projectIdValidation = [param('id').isInt({ min: 1 }).withMessage('Invalid project ID.')];

export const profileValidation = [
  body('full_name').trim().isLength({ min: 2, max: 120 }).withMessage('Full name is required and must be at most 120 characters.'),
  body('headline').trim().isLength({ min: 2, max: 180 }).withMessage('Headline is required and must be at most 180 characters.'),
  body('biography').trim().isLength({ min: 10, max: 5000 }).withMessage('Biography must be between 10 and 5,000 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').isLength({ max: 254 }),
  body('social_links').isObject().withMessage('Social links must be an object.'),
  body('social_links.*').optional({ values: 'falsy' }).isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Social links must be valid http(s) URLs.')
];

export async function updateProfile(req, res) {
  const { full_name, headline, biography, email, social_links } = req.body;
  const [existingRows] = await pool.execute('SELECT profile_image FROM profile WHERE id = 1');
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;
  await pool.execute(
    `INSERT INTO profile (id, full_name, headline, biography, email, social_links, profile_image)
     VALUES (1, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), headline = VALUES(headline),
     biography = VALUES(biography), email = VALUES(email), social_links = VALUES(social_links),
     profile_image = COALESCE(VALUES(profile_image), profile_image)`,
    [full_name.trim(), headline.trim(), biography.trim(), email.trim(), JSON.stringify(social_links), profileImage]
  );
  if (profileImage) removeUploadedFile(existingRows[0]?.profile_image);
  return res.json({ message: 'Profile updated.' });
}

export const passwordValidation = [
  body('current_password').isString().notEmpty().withMessage('Enter your current password.'),
  body('new_password').isString().isLength({ min: 12, max: 128 }).withMessage('New password must be between 12 and 128 characters.')
];
