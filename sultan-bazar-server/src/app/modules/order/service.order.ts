import httpStatus from 'http-status';
import mongoose, { ClientSession } from 'mongoose';
import AppError from '../../errors/AppErrors';
import config from '../../config';
import { sendEmail } from '../../utils/sendEmail';
import { createAdminOrderNotificationEmail, createUserOrderShippedEmail } from '../../helpers/emailTemplate';
import { Cart } from '../cart/model.cart';
import { Product } from '../product/model.product';
import { userServices } from '../user/service.user';
import { FREE_SHIPPING_THRESHOLD, SHIPPING_CHARGE } from './const.order';
import { TOrder, TOrderStatus, TPaymentStatus } from './interface.order';
import { Order } from './model.order';
import { generateOrderNumber } from './utils.order';

type OrderRequestItem = { productId: string; variantId: string; quantity: number };
type PlaceOrderPayload = {
  items: OrderRequestItem[];
  shippingAddress: TOrder['shippingAddress'];
  paymentMethod: 'cod';
  note?: string;
};

const ALLOWED_STATUS_TRANSITIONS: Record<TOrderStatus, TOrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};

const consolidateItems = (items: OrderRequestItem[]) => {
  const consolidated = new Map<string, OrderRequestItem>();
  for (const item of items) {
    const key = `${item.productId}:${item.variantId}`;
    const existing = consolidated.get(key);
    consolidated.set(key, existing ? { ...item, quantity: existing.quantity + item.quantity } : item);
  }
  return [...consolidated.values()];
};

const ensureAllowedTransition = (current: TOrderStatus, next: TOrderStatus) => {
  if (!ALLOWED_STATUS_TRANSITIONS[current].includes(next)) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Cannot change order status from '${current}' to '${next}'`,
      'Invalid order status transition',
    );
  }
};

type StockRestorableOrder = {
  items: Iterable<{
    product: unknown;
    variant?: { variantId?: unknown } | null;
    quantity: number;
  }>;
};

const restoreOrderStock = async (order: StockRestorableOrder, session: ClientSession) => {
  for (const item of order.items) {
    if (!item.variant?.variantId) {
      throw new AppError(httpStatus.CONFLICT, 'Order item is missing its variant snapshot', 'Stock restore failed');
    }
    const updated = await Product.findOneAndUpdate(
      { _id: item.product, 'variants._id': item.variant.variantId },
      { $inc: { 'variants.$.stock': item.quantity } },
      { session, new: true },
    );
    if (!updated) throw new AppError(httpStatus.CONFLICT, 'Product variant is unavailable for stock restoration', 'Stock restore failed');
  }
};

const placeOrder = async (userId: string, payload: PlaceOrderPayload) => {
  const session = await mongoose.startSession();
  let createdOrder: Awaited<ReturnType<typeof Order.create>>[number] | undefined;
  const items = consolidateItems(payload.items);

  try {
    await session.withTransaction(async () => {
      let subtotal = 0;
      const orderItems: TOrder['items'] = [];

      for (const item of items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) throw new AppError(httpStatus.NOT_FOUND, `Product not found: ${item.productId}`, 'Product not found');

        const variant = product.variants.id(item.variantId);
        if (!variant) throw new AppError(httpStatus.NOT_FOUND, 'Variant not found', 'Variant not found');

        const reservedProduct = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            variants: {
              $elemMatch: {
                _id: item.variantId,
                isAvailable: true,
                stock: { $gte: item.quantity },
              },
            },
          },
          { $inc: { 'variants.$.stock': -item.quantity } },
          { session, new: true },
        );

        if (!reservedProduct) {
          throw new AppError(httpStatus.BAD_REQUEST, `Insufficient stock for ${product.name} - ${variant.name}`, 'Insufficient stock');
        }

        const price = variant.discountPrice ?? variant.price;
        const totalPrice = price * item.quantity;
        subtotal += totalPrice;
        orderItems.push({
          product: product._id,
          variant: {
            variantId: variant._id,
            name: variant.name,
            sku: variant.sku,
            price: variant.price,
            discountPrice: variant.discountPrice ?? undefined,
          },
          quantity: item.quantity,
          totalPrice,
        });
      }

      const shippingCharge = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
      const totalAmount = subtotal + shippingCharge;
      const [order] = await Order.create([{
        user: userId,
        orderNumber: generateOrderNumber(),
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

      await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { session });
    });
  } finally {
    await session.endSession();
  }

  if (!createdOrder) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Order could not be created', 'Order creation failed');

  // Address saving and notifications happen only after a successful transaction.
  void userServices.autoSaveAddressFromOrder(userId, payload.shippingAddress);
  void (async () => {
    const populatedOrder = await Order.findById(createdOrder!._id).populate('items.product', 'name thumbnail');
    if (populatedOrder && config.admin_email) {
      await sendEmail(config.admin_email, `New Order Received: #${createdOrder!.orderNumber}`, createAdminOrderNotificationEmail(populatedOrder));
    }
  })().catch(() => undefined);

  return createdOrder;
};

const getMyOrders = async (userId: string) =>
  Order.find({ user: userId }).populate('items.product', 'name thumbnail slug').sort({ createdAt: -1 });

const getOrderById = async (orderId: string, requesterId: string, requesterRole: string) => {
  const order = await Order.findById(orderId)
    .populate('user', 'username email contactNumber')
    .populate('items.product', 'name thumbnail slug');
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found', 'Order not found');

  if ((order.user as unknown as { _id: mongoose.Types.ObjectId })._id.toString() !== requesterId && requesterRole !== 'admin' && requesterRole !== 'superAdmin') {
    throw new AppError(httpStatus.FORBIDDEN, 'Forbidden', 'Access denied');
  }
  return order;
};

const getAllOrders = async (query: Record<string, unknown>) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 20));
  const filter: Record<string, unknown> = {};
  if (query.status) filter.orderStatus = query.status;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.search && typeof query.search === 'string') {
    const search = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);
    filter.$or = [
      { orderNumber: { $regex: search, $options: 'i' } },
      { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
    ];
  }

  const [orders, total] = await Promise.all([
    Order.find(filter).populate('user', 'username email contactNumber').populate('items.product', 'name thumbnail slug').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Order.countDocuments(filter),
  ]);
  return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

const updateOrderStatus = async (orderId: string, status: TOrderStatus, note?: string) => {
  const session = await mongoose.startSession();
  let updatedOrder: Awaited<ReturnType<typeof Order.findById>> = null;
  let shippedOrderNumber = '';
  try {
    await session.withTransaction(async () => {
      const order = await Order.findById(orderId).session(session);
      if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found', 'Order not found');
      ensureAllowedTransition(order.orderStatus as TOrderStatus, status);

      if (status === 'cancelled') await restoreOrderStock(order, session);
      order.orderStatus = status;
      order.statusHistory.push({ status, note, changedAt: new Date() });
      if (status === 'delivered') order.deliveredAt = new Date();
      if (status === 'cancelled') {
        order.cancelledAt = new Date();
        order.cancelReason = note;
      }
      await order.save({ session });
      updatedOrder = order;
      shippedOrderNumber = order.orderNumber;
    });
  } finally {
    await session.endSession();
  }

  if (!updatedOrder) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Order could not be updated', 'Order update failed');
  if (status === 'shipped') {
    void (async () => {
      const populatedOrder = await Order.findById(orderId).populate('user', 'username email').populate('items.product', 'name thumbnail');
      const user = populatedOrder?.user as unknown as { email?: string };
      if (populatedOrder && user?.email && !user.email.endsWith('@guest.invalid')) {
        await sendEmail(user.email, `Your Order #${shippedOrderNumber} has been Shipped!`, createUserOrderShippedEmail(populatedOrder));
      }
    })().catch(() => undefined);
  }
  return updatedOrder;
};

const updatePaymentStatus = async (orderId: string, paymentStatus: TPaymentStatus) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found', 'Order not found');
  order.paymentStatus = paymentStatus;
  await order.save();
  return order;
};

const cancelOrder = async (orderId: string, userId: string, reason?: string) => {
  const session = await mongoose.startSession();
  let cancelledOrder: Awaited<ReturnType<typeof Order.findOne>> = null;
  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ _id: orderId, user: userId }).session(session);
      if (!order) throw new AppError(httpStatus.NOT_FOUND, 'Order not found', 'Order not found');
      ensureAllowedTransition(order.orderStatus as TOrderStatus, 'cancelled');
      await restoreOrderStock(order, session);
      order.orderStatus = 'cancelled';
      order.cancelledAt = new Date();
      order.cancelReason = reason;
      order.statusHistory.push({ status: 'cancelled', note: reason ?? 'Cancelled by customer', changedAt: new Date() });
      await order.save({ session });
      cancelledOrder = order;
    });
  } finally {
    await session.endSession();
  }
  if (!cancelledOrder) throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Order could not be cancelled', 'Order cancellation failed');
  return cancelledOrder;
};

const getSalesAnalytics = async (period: 'daily' | 'monthly' | 'yearly') => {
  const format = period === 'yearly' ? '%Y' : period === 'daily' ? '%Y-%m-%d' : '%Y-%m';
  const result = await Order.aggregate([
    { $match: { orderStatus: 'delivered' } },
    { $group: { _id: { $dateToString: { format, date: '$createdAt' } }, revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  return result.map((item) => ({ date: item._id, revenue: item.revenue, orders: item.orders }));
};

export const orderServices = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getSalesAnalytics,
};
