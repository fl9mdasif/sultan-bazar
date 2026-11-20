"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const config_1 = __importDefault(require("../../config"));
const sendEmail_1 = require("../../utils/sendEmail");
const emailTemplate_1 = require("../../helpers/emailTemplate");
const model_cart_1 = require("../cart/model.cart");
const model_product_1 = require("../product/model.product");
const service_user_1 = require("../user/service.user");
const const_order_1 = require("./const.order");
const model_order_1 = require("./model.order");
const utils_order_1 = require("./utils.order");
const ALLOWED_STATUS_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped'],
    shipped: ['delivered', 'returned'],
    delivered: ['returned'],
    cancelled: [],
    returned: [],
};
const consolidateItems = (items) => {
    const consolidated = new Map();
    for (const item of items) {
        const key = `${item.productId}:${item.variantId}`;
        const existing = consolidated.get(key);
        consolidated.set(key, existing ? Object.assign(Object.assign({}, item), { quantity: existing.quantity + item.quantity }) : item);
    }
    return [...consolidated.values()];
};
const ensureAllowedTransition = (current, next) => {
    if (!ALLOWED_STATUS_TRANSITIONS[current].includes(next)) {
        throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `Cannot change order status from '${current}' to '${next}'`, 'Invalid order status transition');
    }
};
const restoreOrderStock = (order, session) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    for (const item of order.items) {
        if (!((_a = item.variant) === null || _a === void 0 ? void 0 : _a.variantId)) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, 'Order item is missing its variant snapshot', 'Stock restore failed');
        }
        const updated = yield model_product_1.Product.findOneAndUpdate({ _id: item.product, 'variants._id': item.variant.variantId }, { $inc: { 'variants.$.stock': item.quantity } }, { session, new: true });
        if (!updated)
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, 'Product variant is unavailable for stock restoration', 'Stock restore failed');
    }
});
const placeOrder = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    let createdOrder;
    const items = consolidateItems(payload.items);
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            let subtotal = 0;
            const orderItems = [];
            for (const item of items) {
                const product = yield model_product_1.Product.findById(item.productId).session(session);
                if (!product)
                    throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, `Product not found: ${item.productId}`, 'Product not found');
                const variant = product.variants.id(item.variantId);
                if (!variant)
                    throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Variant not found', 'Variant not found');
                const reservedProduct = yield model_product_1.Product.findOneAndUpdate({
                    _id: item.productId,
                    variants: {
                        $elemMatch: {
                            _id: item.variantId,
                            isAvailable: true,
                            stock: { $gte: item.quantity },
                        },
                    },
                }, { $inc: { 'variants.$.stock': -item.quantity } }, { session, new: true });
                if (!reservedProduct) {
                    throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, `Insufficient stock for ${product.name} - ${variant.name}`, 'Insufficient stock');
                }
                const price = (_a = variant.discountPrice) !== null && _a !== void 0 ? _a : variant.price;
                const totalPrice = price * item.quantity;
                subtotal += totalPrice;
                orderItems.push({
                    product: product._id,
                    variant: {
                        variantId: variant._id,
                        name: variant.name,
                        sku: variant.sku,
                        price: variant.price,
                        discountPrice: (_b = variant.discountPrice) !== null && _b !== void 0 ? _b : undefined,
                    },
                    quantity: item.quantity,
                    totalPrice,
                });
            }
            const shippingCharge = subtotal >= const_order_1.FREE_SHIPPING_THRESHOLD ? 0 : const_order_1.SHIPPING_CHARGE;
            const totalAmount = subtotal + shippingCharge;
            const [order] = yield model_order_1.Order.create([{
                    user: userId,
                    orderNumber: (0, utils_order_1.generateOrderNumber)(),
                    items: orderItems,
                    shippingAddress: payload.shippingAddress,
                    paymentMethod: 'cod',
                    subtotal,
                    shippingCharge,
                    totalAmount,
                    note: payload.note,
                    statusHistory: [{ status: 'pending', note: 'Order placed' }],
                }], { session });
            createdOrder = order;
            yield model_cart_1.Cart.findOneAndUpdate({ user: userId }, { items: [] }, { session });
        }));
    }
    finally {
        yield session.endSession();
    }
    if (!createdOrder)
        throw new AppErrors_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Order could not be created', 'Order creation failed');
    // Address saving and notifications happen only after a successful transaction.
    void service_user_1.userServices.autoSaveAddressFromOrder(userId, payload.shippingAddress);
    void (() => __awaiter(void 0, void 0, void 0, function* () {
        const populatedOrder = yield model_order_1.Order.findById(createdOrder._id).populate('items.product', 'name thumbnail');
        if (populatedOrder && config_1.default.admin_email) {
            yield (0, sendEmail_1.sendEmail)(config_1.default.admin_email, `New Order Received: #${createdOrder.orderNumber}`, (0, emailTemplate_1.createAdminOrderNotificationEmail)(populatedOrder));
        }
    }))().catch(() => undefined);
    return createdOrder;
});
const getMyOrders = (userId) => __awaiter(void 0, void 0, void 0, function* () { return model_order_1.Order.find({ user: userId }).populate('items.product', 'name thumbnail slug').sort({ createdAt: -1 }); });
const getOrderById = (orderId, requesterId, requesterRole) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield model_order_1.Order.findById(orderId)
        .populate('user', 'username email contactNumber')
        .populate('items.product', 'name thumbnail slug');
    if (!order)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    if (order.user._id.toString() !== requesterId && requesterRole !== 'admin' && requesterRole !== 'superAdmin') {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'Forbidden', 'Access denied');
    }
    return order;
});
const getAllOrders = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
    const filter = {};
    if (query.status)
        filter.orderStatus = query.status;
    if (query.paymentStatus)
        filter.paymentStatus = query.paymentStatus;
    if (query.search && typeof query.search === 'string') {
        const search = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);
        filter.$or = [
            { orderNumber: { $regex: search, $options: 'i' } },
            { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
            { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
        ];
    }
    const [orders, total] = yield Promise.all([
        model_order_1.Order.find(filter).populate('user', 'username email contactNumber').populate('items.product', 'name thumbnail slug').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
        model_order_1.Order.countDocuments(filter),
    ]);
    return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
});
const updateOrderStatus = (orderId, status, note) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    let updatedOrder = null;
    let shippedOrderNumber = '';
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield model_order_1.Order.findById(orderId).session(session);
            if (!order)
                throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
            ensureAllowedTransition(order.orderStatus, status);
            if (status === 'cancelled')
                yield restoreOrderStock(order, session);
            order.orderStatus = status;
            order.statusHistory.push({ status, note, changedAt: new Date() });
            if (status === 'delivered')
                order.deliveredAt = new Date();
            if (status === 'cancelled') {
                order.cancelledAt = new Date();
                order.cancelReason = note;
            }
            yield order.save({ session });
            updatedOrder = order;
            shippedOrderNumber = order.orderNumber;
        }));
    }
    finally {
        yield session.endSession();
    }
    if (!updatedOrder)
        throw new AppErrors_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Order could not be updated', 'Order update failed');
    if (status === 'shipped') {
        void (() => __awaiter(void 0, void 0, void 0, function* () {
            const populatedOrder = yield model_order_1.Order.findById(orderId).populate('user', 'username email').populate('items.product', 'name thumbnail');
            const user = populatedOrder === null || populatedOrder === void 0 ? void 0 : populatedOrder.user;
            if (populatedOrder && (user === null || user === void 0 ? void 0 : user.email) && !user.email.endsWith('@guest.invalid')) {
                yield (0, sendEmail_1.sendEmail)(user.email, `Your Order #${shippedOrderNumber} has been Shipped!`, (0, emailTemplate_1.createUserOrderShippedEmail)(populatedOrder));
            }
        }))().catch(() => undefined);
    }
    return updatedOrder;
});
const updatePaymentStatus = (orderId, paymentStatus) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield model_order_1.Order.findById(orderId);
    if (!order)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
    order.paymentStatus = paymentStatus;
    yield order.save();
    return order;
});
const cancelOrder = (orderId, userId, reason) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    let cancelledOrder = null;
    try {
        yield session.withTransaction(() => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield model_order_1.Order.findOne({ _id: orderId, user: userId }).session(session);
            if (!order)
                throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Order not found', 'Order not found');
            ensureAllowedTransition(order.orderStatus, 'cancelled');
            yield restoreOrderStock(order, session);
            order.orderStatus = 'cancelled';
            order.cancelledAt = new Date();
            order.cancelReason = reason;
            order.statusHistory.push({ status: 'cancelled', note: reason !== null && reason !== void 0 ? reason : 'Cancelled by customer', changedAt: new Date() });
            yield order.save({ session });
            cancelledOrder = order;
        }));
    }
    finally {
        yield session.endSession();
    }
    if (!cancelledOrder)
        throw new AppErrors_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'Order could not be cancelled', 'Order cancellation failed');
    return cancelledOrder;
});
const getSalesAnalytics = (period) => __awaiter(void 0, void 0, void 0, function* () {
    const format = period === 'yearly' ? '%Y' : period === 'daily' ? '%Y-%m-%d' : '%Y-%m';
    const result = yield model_order_1.Order.aggregate([
        { $match: { orderStatus: 'delivered' } },
        { $group: { _id: { $dateToString: { format, date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);
    return result.map((item) => ({ date: item._id, revenue: item.revenue, orders: item.orders }));
});
exports.orderServices = {
    placeOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    getSalesAnalytics,
};
