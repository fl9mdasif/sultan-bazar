"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const controller_order_1 = require("./controller.order");
const validation_order_1 = require("./validation.order");
const router = express_1.default.Router();
// ── User routes ────────────────────────────────────────────────────────────────
// POST /api/orders  — place a new order
router.post('/', (0, authorize_1.default)('placeOrder'), (0, validateRequest_1.default)(validation_order_1.orderValidations.placeOrderValidationSchema), controller_order_1.orderControllers.placeOrder);
// GET /api/orders/my-orders  — logged-in user's orders (must come before /:orderId)
router.get('/my-orders', (0, authorize_1.default)('placeOrder'), controller_order_1.orderControllers.getMyOrders);
// GET /api/orders/:orderId  — single order detail (owner or admin)
router.get('/:orderId', (0, authorize_1.default)('manageOwnAccount'), controller_order_1.orderControllers.getOrderById);
// PATCH /api/orders/:orderId/cancel  — user cancels their own order
router.patch('/:orderId/cancel', (0, authorize_1.default)('placeOrder'), controller_order_1.orderControllers.cancelOrder);
// ── Admin routes ───────────────────────────────────────────────────────────────
// GET /api/orders/analytics/sales  — admin charting data
router.get('/analytics/sales', (0, authorize_1.default)('viewSalesAnalytics'), controller_order_1.orderControllers.getSalesAnalytics);
// GET /api/orders  — all orders (paginated + filterable by status)
router.get('/', (0, authorize_1.default)('manageOrders'), controller_order_1.orderControllers.getAllOrders);
// PATCH /api/orders/:orderId/status  — update lifecycle status
router.patch('/:orderId/status', (0, authorize_1.default)('manageOrders'), (0, validateRequest_1.default)(validation_order_1.orderValidations.updateOrderStatusValidationSchema), controller_order_1.orderControllers.updateOrderStatus);
// PATCH /api/orders/:orderId/payment-status  — update payment status
router.patch('/:orderId/payment-status', (0, authorize_1.default)('manageOrders'), (0, validateRequest_1.default)(validation_order_1.orderValidations.updatePaymentStatusValidationSchema), controller_order_1.orderControllers.updatePaymentStatus);
exports.orderRoutes = router;
