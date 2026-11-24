import { validationResult } from 'express-validator';
import { removeUploadedFile } from './upload.js';

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) removeUploadedFile(`/uploads/${req.file.filename}`);
    return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  return next();
}
