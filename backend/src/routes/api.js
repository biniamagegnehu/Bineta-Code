import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';
import { projectImageUpload } from '../middleware/upload.js';
import { parseProfileSocialLinks, parseProjectTechnologies } from '../middleware/projectInput.js';
import { login, loginValidation } from '../controllers/authController.js';
import { contactValidation, getProfile, getProjects, submitContact } from '../controllers/publicController.js';
import {
  createProject, createProjectValidation, deleteMessage, deleteProject, getMessages,
  getOverview, messageIdValidation, messageStatusValidation, passwordValidation,
  profileValidation, projectIdValidation, setMessageStatus, updateProfile,
  updateProject, updateProjectValidation
} from '../controllers/adminController.js';
import { changePassword } from '../controllers/passwordController.js';

const router = Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });
const contactLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });

router.get('/health', asyncHandler(async (req, res) => {
  res.json({ status: 'ok' });
}));
router.get('/profile', asyncHandler(getProfile));
router.get('/projects', asyncHandler(getProjects));
router.post('/contact', contactLimiter, contactValidation, validate, asyncHandler(submitContact));
router.post('/auth/login', loginLimiter, loginValidation, validate, asyncHandler(login));

router.use('/admin', requireAdmin);
router.get('/admin/overview', asyncHandler(getOverview));
router.get('/admin/messages', asyncHandler(getMessages));
router.patch('/admin/messages/:id', messageStatusValidation, validate, asyncHandler(setMessageStatus));
router.delete('/admin/messages/:id', messageIdValidation, validate, asyncHandler(deleteMessage));
router.post('/admin/projects', projectImageUpload, parseProjectTechnologies, createProjectValidation, validate, asyncHandler(createProject));
router.put('/admin/projects/:id', projectImageUpload, parseProjectTechnologies, updateProjectValidation, validate, asyncHandler(updateProject));
router.delete('/admin/projects/:id', projectIdValidation, validate, asyncHandler(deleteProject));
router.put('/admin/profile', projectImageUpload, parseProfileSocialLinks, profileValidation, validate, asyncHandler(updateProfile));
router.put('/admin/password', passwordValidation, validate, asyncHandler(changePassword));

export default router;
