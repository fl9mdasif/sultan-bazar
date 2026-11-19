import { z } from 'zod';

// ── Shared sub-schemas ─────────────────────────────────────────────────────────
const shippingAddressSchema = z.object({
    fullName: z.string({ message: 'Full name is required' }).trim().min(1),
    phone: z.string({ message: 'Phone is required' }).trim().min(1),
    address: z.string({ message: 'Address is required' }).trim().min(1),
    city: z.string({ message: 'City is required' }).trim().min(1),
    district: z.string({ message: 'District is required' }).trim().min(1),
    postalCode: z.string().optional(),
    country: z.string().optional().default('Bangladesh'),
});

const orderItemSchema = z.object({
    productId: z.string({ message: 'Product ID is required' }),
    variantId: z.string({ message: 'Variant ID is required' }),
    quantity: z.number({ message: 'Quantity is required' }).int().min(1),
});

// ── Place Order ────────────────────────────────────────────────────────────────
const placeOrderValidationSchema = z.object({
    body: z.object({
        items: z
            .array(orderItemSchema)
            .min(1, { message: 'At least one item is required' }),
        shippingAddress: shippingAddressSchema,
        paymentMethod: z.literal('cod', {
            message: 'Cash on Delivery is the only supported payment method',
        }),
        note: z.string().optional(),
    }),
});

// ── Update Order Status (admin) ────────────────────────────────────────────────
const updateOrderStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(
            ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
            { message: 'Invalid order status' },
        ),
        note: z.string().optional(),
    }),
});

// ── Update Payment Status (admin) ──────────────────────────────────────────────
const updatePaymentStatusValidationSchema = z.object({
    body: z.object({
        paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded'], {
            message: 'Invalid payment status',
        }),
    }),
});

export const orderValidations = {
    placeOrderValidationSchema,
    updateOrderStatusValidationSchema,
    updatePaymentStatusValidationSchema,
};
