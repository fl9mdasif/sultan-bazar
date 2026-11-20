import express from 'express';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { categoryControllers } from './controller.category';
import { categoryValidations } from './validation.category';

const router = express.Router();

// POST /api/categories  — admin / superAdmin only
router.post(
  '/',
  authorize('manageCategories'),
  validateRequest(categoryValidations.createCategoryValidationSchema),
  categoryControllers.createCategory,
);

// GET /api/categories  — public
router.get('/', categoryControllers.getAllCategories);
router.get('/admin', authorize('manageCategories'), categoryControllers.getAllCategoriesForAdmin);
router.get('/admin/:categoryId', authorize('manageCategories'), categoryControllers.getSingleCategoryForAdmin);

// GET /api/categories/:categoryId  — public (accepts ObjectId or slug)
router.get('/:categoryId', categoryControllers.getSingleCategory);

// PATCH /api/categories/:categoryId  — admin / superAdmin only
router.patch(
  '/:categoryId',
  authorize('manageCategories'),
  validateRequest(categoryValidations.updateCategoryValidationSchema),
  categoryControllers.updateCategory,
);

// PATCH /api/categories/:categoryId/toggle-status  — admin / superAdmin only
router.patch(
  '/:categoryId/toggle-status',
  authorize('manageCategories'),
  categoryControllers.toggleCategoryStatus,
);

// DELETE /api/categories/:categoryId  — superAdmin only
router.delete(
  '/:categoryId',
  authorize('manageCategories'),
  categoryControllers.deleteCategory,
);

export const categoryRoutes = router;
