import express from 'express';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { cartControllers } from './controller.cart';
import { cartValidations } from './validation.cart';

const router = express.Router();

router.post(
    '/',
    authorize('manageOwnCart'),
    validateRequest(cartValidations.addToCartValidationSchema),
    cartControllers.addToCart,
);

router.get(
    '/',
    authorize('manageOwnCart'),
    cartControllers.getCart,
);

router.patch(
    '/:productId/:variantId',
    authorize('manageOwnCart'),
    validateRequest(cartValidations.updateCartItemValidationSchema),
    cartControllers.updateCartItemQuantity,
);

router.delete(
    '/:productId/:variantId',
    authorize('manageOwnCart'),
    cartControllers.removeFromCart,
);

router.delete(
    '/',
    authorize('manageOwnCart'),
    cartControllers.clearCart,
);

export const cartRoutes = router;
