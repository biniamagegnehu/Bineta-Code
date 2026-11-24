import { MulterError } from 'multer';
import { config } from '../config/env.js';

export function notFound(req, res) {
  res.status(404).json({ error: 'The requested API endpoint was not found.' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error instanceof MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(status).json({ error: status === 413 ? 'Image must be 5 MB or smaller.' : 'The uploaded image could not be accepted.' });
  }

  if (error.message === 'Only JPEG, PNG, WebP, or GIF images are allowed.') {
    return res.status(400).json({ error: error.message });
  }

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ error: 'That username or email is already in use.' });
  }

  if (config.nodeEnv !== 'production') {
    console.error(error);
  } else {
    console.error(`${req.method} ${req.originalUrl}: ${error.message}`);
  }

  return res.status(500).json({ error: 'An unexpected server error occurred.' });
}
