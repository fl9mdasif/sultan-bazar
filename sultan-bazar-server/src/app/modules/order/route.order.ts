import express from 'express';
import authorize from '../../middlewares/authorize';
import validateRequest from '../../middlewares/validateRequest';
import { orderControllers } from './controller.order';
import { orderValidations } from './validation.order';

const router = express.Router();

// ── User routes ────────────────────────────────────────────────────────────────

// POST /api/orders  — place a new order
router.post(
    '/',
    authorize('placeOrder'),
    validateRequest(orderValidations.placeOrderValidationSchema),
    orderControllers.placeOrder,
);

// GET /api/orders/my-orders  — logged-in user's orders (must come before /:orderId)
router.get(
    '/my-orders',
    authorize('placeOrder'),
    orderControllers.getMyOrders,
);

// GET /api/orders/:orderId  — single order detail (owner or admin)
router.get(
    '/:orderId',
    authorize('manageOwnAccount'),
    orderControllers.getOrderById,
);

// PATCH /api/orders/:orderId/cancel  — user cancels their own order
router.patch(
    '/:orderId/cancel',
    authorize('placeOrder'),
    orderControllers.cancelOrder,
);

// ── Admin routes ───────────────────────────────────────────────────────────────

// GET /api/orders/analytics/sales  — admin charting data
router.get(
    '/analytics/sales',
    authorize('viewSalesAnalytics'),
    orderControllers.getSalesAnalytics,
);

// GET /api/orders  — all orders (paginated + filterable by status)
router.get(
    '/',
    authorize('manageOrders'),
    orderControllers.getAllOrders,
);

// PATCH /api/orders/:orderId/status  — update lifecycle status
router.patch(
    '/:orderId/status',
    authorize('manageOrders'),
    validateRequest(orderValidations.updateOrderStatusValidationSchema),
    orderControllers.updateOrderStatus,
);

// PATCH /api/orders/:orderId/payment-status  — update payment status
router.patch(
    '/:orderId/payment-status',
    authorize('manageOrders'),
    validateRequest(orderValidations.updatePaymentStatusValidationSchema),
    orderControllers.updatePaymentStatus,
);

export const orderRoutes = router;
