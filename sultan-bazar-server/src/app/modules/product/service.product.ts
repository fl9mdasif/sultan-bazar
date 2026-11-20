import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import { TProduct } from './interface.product';
import { Product } from './model.product';
import mongoose from 'mongoose';
import { Order } from '../order/model.order';
import { Review } from '../review/model.review';

// ── Helpers ──────────────────────────────────────────────────────────────────
const isObjectId = (val: string) => /^[a-f\d]{24}$/i.test(val);
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PRODUCT_SORTS: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 }, oldest: { createdAt: 1 }, priceAsc: { 'variants.price': 1 }, priceDesc: { 'variants.price': -1 }, rating: { rating: -1 },
};

// ── Create ───────────────────────────────────────────────────────────────────
const createProduct = async (payload: TProduct) => {
    // Duplicate name check (case-insensitive)
    const existingName = await Product.findOne({
        name: { $regex: `^${payload.name}$`, $options: 'i' },
    });
    if (existingName) {
        throw new AppError(
            httpStatus.CONFLICT,
            `A product named '${existingName.name}' already exists.`,
            'Duplicate name',
        );
    }

    // Duplicate slug check
    const existingSlug = await Product.findOne({ slug: payload.slug });
    if (existingSlug) {
        throw new AppError(
            httpStatus.CONFLICT,
            `A product with slug '${payload.slug}' already exists.`,
            'Duplicate slug',
        );
    }

    const product = await Product.create(payload);
    return product.populate('category', 'name slug');
};

// ── Get All ──────────────────────────────────────────────────────────────────
const getAllProducts = async (query: Record<string, unknown>, includeNonActive = false) => {
    const {
        search,
        category,
        status,
        isFeatured,
        minPrice,
        maxPrice,
        sort = 'newest',
        page = 1,
        limit = 12,
    } = query;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: Record<string, any> = includeNonActive ? {} : { status: 'active' };

    // Improved search (substring matching)
    if (search) {
        const searchTerm = escapeRegex(String(search)).slice(0, 100);
        filter.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { tags: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
        ];
    }

    if (category) filter.category = category;
    if (includeNonActive && status) filter.status = status;
    if (isFeatured !== undefined)
        filter.isFeatured = isFeatured === 'true' || isFeatured === true;

    // Price filter — applied to variants.price range
    if (minPrice || maxPrice) {
        filter['variants.price'] = {};
        if (minPrice) filter['variants.price'].$gte = Number(minPrice);
        if (maxPrice) filter['variants.price'].$lte = Number(maxPrice);
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate('category', 'name slug')
            .sort(PRODUCT_SORTS[String(sort)] ?? PRODUCT_SORTS.newest)
            .skip(skip)
            .limit(limitNum),
        Product.countDocuments(filter),
    ]);

    return {
        data: products,
        meta: {
            total,
            page: pageNum,
            limit: limitNum,
            totalPages: Math.ceil(total / limitNum),
        },
    };
};

// ── Get Single ───────────────────────────────────────────────────────────────
const getSingleProduct = async (idOrSlug: string, includeNonActive = false) => {
    const product = isObjectId(idOrSlug)
        ? await Product.findOne({ _id: idOrSlug, ...(includeNonActive ? {} : { status: 'active' }) }).populate('category', 'name slug')
        : await Product.findOne({ slug: idOrSlug, ...(includeNonActive ? {} : { status: 'active' }) }).populate('category', 'name slug');

    if (!product) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
            'No product found with the given id or slug',
        );
    }
    return product;
};

// ── Update ───────────────────────────────────────────────────────────────────
const updateProduct = async (id: string, payload: Partial<TProduct>) => {
    // Duplicate name check (case-insensitive, exclude self)
    if (payload.name) {
        const existingName = await Product.findOne({
            name: { $regex: `^${payload.name}$`, $options: 'i' },
            _id: { $ne: id },
        });
        if (existingName) {
            throw new AppError(
                httpStatus.CONFLICT,
                `A product named '${existingName.name}' already exists.`,
                'Duplicate name',
            );
        }
    }

    // Duplicate slug check (exclude self)
    if (payload.slug) {
        const existingSlug = await Product.findOne({
            slug: payload.slug,
            _id: { $ne: id },
        });
        if (existingSlug) {
            throw new AppError(
                httpStatus.CONFLICT,
                `A product with slug '${payload.slug}' already exists.`,
                'Duplicate slug',
            );
        }
    }

    const updated = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate('category', 'name slug');

    if (!updated) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
            'No product found with the given id',
        );
    }
    return updated;
};

// ── Delete ───────────────────────────────────────────────────────────────────
const deleteProduct = async (id: string) => {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
            'No product found with the given id',
        );
    }
    return deleted;
};

// ── Toggle Featured ──────────────────────────────────────────────────────────
const toggleFeatured = async (id: string) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product not found',
            'No product found with the given id',
        );
    }
    product.isFeatured = !product.isFeatured;
    await product.save();
    return product;
};

// ── Update a Variant ─────────────────────────────────────────────────────────
const updateVariant = async (
    productId: string,
    variantId: string,
    payload: Record<string, unknown>,
) => {
    // Build a $set map that targets only the variant fields supplied
    const setFields: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(payload)) {
        setFields[`variants.$.${key}`] = value;
    }

    const product = await Product.findOneAndUpdate(
        {
            _id: productId,
            'variants._id': new mongoose.Types.ObjectId(variantId),
        },
        { $set: setFields },
        { new: true, runValidators: true },
    );

    if (!product) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Product or variant not found',
            '',
        );
    }
    return product;
};

// ── Add Review Rating ────────────────────────────────────────────────────────
const addReviewRating = async (
    productId: string,
    userId: string,
    input: { rating: number; orderId: string; variantId: string; comment?: string },
) => {
    const product = await Product.findById(productId);
    if (!product) throw new AppError(httpStatus.NOT_FOUND, 'Product not found', 'No product found');

    const eligibleItem = {
        product: new mongoose.Types.ObjectId(productId),
        'variant.variantId': new mongoose.Types.ObjectId(input.variantId),
        isReviewed: false,
    };
    const order = await Order.findOne({
        _id: input.orderId,
        user: userId,
        orderStatus: 'delivered',
        items: { $elemMatch: eligibleItem },
    });
    if (!order) {
        throw new AppError(httpStatus.FORBIDDEN, 'Only delivered items in your own orders can be reviewed once', 'Review not allowed');
    }

    try {
        await Review.create({
            product: productId,
            user: userId,
            order: input.orderId,
            variantId: input.variantId,
            rating: input.rating,
            comment: input.comment,
        });
    } catch (error: unknown) {
        if (typeof error === 'object' && error && 'code' in error && error.code === 11000) {
            throw new AppError(httpStatus.CONFLICT, 'You have already reviewed this product', 'Duplicate review');
        }
        throw error;
    }

    const [aggregate] = await Review.aggregate<{ average: number; count: number }>([
        { $match: { product: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const updated = await Product.findByIdAndUpdate(
        productId,
        { rating: Number((aggregate?.average ?? 0).toFixed(1)), reviewCount: aggregate?.count ?? 0 },
        { new: true },
    );
    await Order.updateOne(
        { _id: order._id, user: userId, items: { $elemMatch: eligibleItem } },
        { $set: { 'items.$.isReviewed': true } },
    );
    return updated;
};

export const productServices = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    updateVariant,
    addReviewRating,
};
