import authorize from '../../middlewares/authorize';
import { generateUploadUrl } from './controller.upload';
import { Router } from 'express';
// import { generateUploadUrl } from '../controllers/upload.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // Import your authentication middleware

const router = Router();

// This endpoint MUST be protected so only logged-in admins can use it
router.post(
  '/generate-upload-url',
  authorize('manageCatalog'),
  generateUploadUrl
);

export const ImageUploads = router;
