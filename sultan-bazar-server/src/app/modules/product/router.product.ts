import express from 'express';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { productControllers } from './controller.product';
import { productValidations } from './validation.product';

const router = express.Router();

// POST /api/products  — admin / superAdmin
router.post(
    '/',
    authorize('manageCatalog'),
    validateRequest(productValidations.createProductValidationSchema),
    productControllers.createProduct,
);

// GET /api/products  — public (supports ?search, ?category, ?status, ?isFeatured, ?minPrice, ?maxPrice, ?sort, ?page, ?limit)
router.get('/', productControllers.getAllProducts);
router.get('/admin', authorize('manageCatalog'), productControllers.getAllProductsForAdmin);
router.get('/admin/:productId', authorize('manageCatalog'), productControllers.getSingleProductForAdmin);

// GET /api/products/:productId  — public (accepts ObjectId or slug)
router.get('/:productId', productControllers.getSingleProduct);

// PATCH /api/products/:productId  — admin / superAdmin
router.patch(
    '/:productId',
    authorize('manageCatalog'),
    validateRequest(productValidations.updateProductValidationSchema),
    productControllers.updateProduct,
);

// PATCH /api/products/:productId/toggle-featured  — admin / superAdmin
router.patch(
    '/:productId/toggle-featured',
    authorize('manageCatalog'),
    productControllers.toggleFeatured,
);

// PATCH /api/products/:productId/variants/:variantId  — admin / superAdmin
router.patch(
    '/:productId/variants/:variantId',
    authorize('manageCatalog'),
    validateRequest(productValidations.updateVariantValidationSchema),
    productControllers.updateVariant,
);

// DELETE /api/products/:productId  — admin / superAdmin
router.delete(
    '/:productId',
    authorize('manageCatalog'),
    productControllers.deleteProduct,
);

// POST /api/products/:productId/review — user
router.post(
    '/:productId/review',
    authorize('placeOrder'),
    validateRequest(productValidations.addReviewValidationSchema),
    productControllers.addReviewRating,
);

export const productRoutes = router;
