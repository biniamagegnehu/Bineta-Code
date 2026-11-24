import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import { config } from '../config/env.js';

fs.mkdirSync(config.uploadDir, { recursive: true });

const allowedTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif']
]);

const storage = multer.diskStorage({
  destination: (req, file, callback) => callback(null, config.uploadDir),
  filename: (req, file, callback) => callback(null, `${crypto.randomUUID()}${allowedTypes.get(file.mimetype)}`)
});

export const projectImageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      return callback(new Error('Only JPEG, PNG, WebP, or GIF images are allowed.'));
    }
    return callback(null, true);
  }
}).single('image');

export function removeUploadedFile(filePath) {
  if (!filePath || !filePath.startsWith('/uploads/')) return;
  const resolved = path.resolve(config.uploadDir, path.basename(filePath));
  if (path.dirname(resolved) !== config.uploadDir) return;
  fs.promises.unlink(resolved).catch((error) => {
    if (error.code !== 'ENOENT') console.error(`Could not remove uploaded file: ${error.message}`);
  });
}
