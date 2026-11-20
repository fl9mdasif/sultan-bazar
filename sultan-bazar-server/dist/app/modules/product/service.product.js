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
exports.productServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const model_product_1 = require("./model.product");
const mongoose_1 = __importDefault(require("mongoose"));
const model_order_1 = require("../order/model.order");
const model_review_1 = require("../review/model.review");
// ── Helpers ──────────────────────────────────────────────────────────────────
const isObjectId = (val) => /^[a-f\d]{24}$/i.test(val);
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PRODUCT_SORTS = {
    newest: { createdAt: -1 }, oldest: { createdAt: 1 }, priceAsc: { 'variants.price': 1 }, priceDesc: { 'variants.price': -1 }, rating: { rating: -1 },
};
// ── Create ───────────────────────────────────────────────────────────────────
const createProduct = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Duplicate name check (case-insensitive)
    const existingName = yield model_product_1.Product.findOne({
        name: { $regex: `^${payload.name}$`, $options: 'i' },
    });
    if (existingName) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A product named '${existingName.name}' already exists.`, 'Duplicate name');
    }
    // Duplicate slug check
    const existingSlug = yield model_product_1.Product.findOne({ slug: payload.slug });
    if (existingSlug) {
        throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A product with slug '${payload.slug}' already exists.`, 'Duplicate slug');
    }
    const product = yield model_product_1.Product.create(payload);
    return product.populate('category', 'name slug');
});
// ── Get All ──────────────────────────────────────────────────────────────────
const getAllProducts = (query_1, ...args_1) => __awaiter(void 0, [query_1, ...args_1], void 0, function* (query, includeNonActive = false) {
    var _a;
    const { search, category, status, isFeatured, minPrice, maxPrice, sort = 'newest', page = 1, limit = 12, } = query;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter = includeNonActive ? {} : { status: 'active' };
    // Improved search (substring matching)
    if (search) {
        const searchTerm = escapeRegex(String(search)).slice(0, 100);
        filter.$or = [
            { name: { $regex: searchTerm, $options: 'i' } },
            { tags: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
        ];
    }
    if (category)
        filter.category = category;
    if (includeNonActive && status)
        filter.status = status;
    if (isFeatured !== undefined)
        filter.isFeatured = isFeatured === 'true' || isFeatured === true;
    // Price filter — applied to variants.price range
    if (minPrice || maxPrice) {
        filter['variants.price'] = {};
        if (minPrice)
            filter['variants.price'].$gte = Number(minPrice);
        if (maxPrice)
            filter['variants.price'].$lte = Number(maxPrice);
    }
    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 12));
    const skip = (pageNum - 1) * limitNum;
    const [products, total] = yield Promise.all([
        model_product_1.Product.find(filter)
            .populate('category', 'name slug')
            .sort((_a = PRODUCT_SORTS[String(sort)]) !== null && _a !== void 0 ? _a : PRODUCT_SORTS.newest)
            .skip(skip)
            .limit(limitNum),
        model_product_1.Product.countDocuments(filter),
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
});
// ── Get Single ───────────────────────────────────────────────────────────────
const getSingleProduct = (idOrSlug_1, ...args_1) => __awaiter(void 0, [idOrSlug_1, ...args_1], void 0, function* (idOrSlug, includeNonActive = false) {
    const product = isObjectId(idOrSlug)
        ? yield model_product_1.Product.findOne(Object.assign({ _id: idOrSlug }, (includeNonActive ? {} : { status: 'active' }))).populate('category', 'name slug')
        : yield model_product_1.Product.findOne(Object.assign({ slug: idOrSlug }, (includeNonActive ? {} : { status: 'active' }))).populate('category', 'name slug');
    if (!product) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'No product found with the given id or slug');
    }
    return product;
});
// ── Update ───────────────────────────────────────────────────────────────────
const updateProduct = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Duplicate name check (case-insensitive, exclude self)
    if (payload.name) {
        const existingName = yield model_product_1.Product.findOne({
            name: { $regex: `^${payload.name}$`, $options: 'i' },
            _id: { $ne: id },
        });
        if (existingName) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A product named '${existingName.name}' already exists.`, 'Duplicate name');
        }
    }
    // Duplicate slug check (exclude self)
    if (payload.slug) {
        const existingSlug = yield model_product_1.Product.findOne({
            slug: payload.slug,
            _id: { $ne: id },
        });
        if (existingSlug) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, `A product with slug '${payload.slug}' already exists.`, 'Duplicate slug');
        }
    }
    const updated = yield model_product_1.Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate('category', 'name slug');
    if (!updated) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'No product found with the given id');
    }
    return updated;
});
// ── Delete ───────────────────────────────────────────────────────────────────
const deleteProduct = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield model_product_1.Product.findByIdAndDelete(id);
    if (!deleted) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'No product found with the given id');
    }
    return deleted;
});
// ── Toggle Featured ──────────────────────────────────────────────────────────
const toggleFeatured = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield model_product_1.Product.findById(id);
    if (!product) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'No product found with the given id');
    }
    product.isFeatured = !product.isFeatured;
    yield product.save();
    return product;
});
// ── Update a Variant ─────────────────────────────────────────────────────────
const updateVariant = (productId, variantId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Build a $set map that targets only the variant fields supplied
    const setFields = {};
    for (const [key, value] of Object.entries(payload)) {
        setFields[`variants.$.${key}`] = value;
    }
    const product = yield model_product_1.Product.findOneAndUpdate({
        _id: productId,
        'variants._id': new mongoose_1.default.Types.ObjectId(variantId),
    }, { $set: setFields }, { new: true, runValidators: true });
    if (!product) {
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product or variant not found', '');
    }
    return product;
});
// ── Add Review Rating ────────────────────────────────────────────────────────
const addReviewRating = (productId, userId, input) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const product = yield model_product_1.Product.findById(productId);
    if (!product)
        throw new AppErrors_1.default(http_status_1.default.NOT_FOUND, 'Product not found', 'No product found');
    const eligibleItem = {
        product: new mongoose_1.default.Types.ObjectId(productId),
        'variant.variantId': new mongoose_1.default.Types.ObjectId(input.variantId),
        isReviewed: false,
    };
    const order = yield model_order_1.Order.findOne({
        _id: input.orderId,
        user: userId,
        orderStatus: 'delivered',
        items: { $elemMatch: eligibleItem },
    });
    if (!order) {
        throw new AppErrors_1.default(http_status_1.default.FORBIDDEN, 'Only delivered items in your own orders can be reviewed once', 'Review not allowed');
    }
    try {
        yield model_review_1.Review.create({
            product: productId,
            user: userId,
            order: input.orderId,
            variantId: input.variantId,
            rating: input.rating,
            comment: input.comment,
        });
    }
    catch (error) {
        if (typeof error === 'object' && error && 'code' in error && error.code === 11000) {
            throw new AppErrors_1.default(http_status_1.default.CONFLICT, 'You have already reviewed this product', 'Duplicate review');
        }
        throw error;
    }
    const [aggregate] = yield model_review_1.Review.aggregate([
        { $match: { product: new mongoose_1.default.Types.ObjectId(productId) } },
        { $group: { _id: '$product', average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const updated = yield model_product_1.Product.findByIdAndUpdate(productId, { rating: Number(((_a = aggregate === null || aggregate === void 0 ? void 0 : aggregate.average) !== null && _a !== void 0 ? _a : 0).toFixed(1)), reviewCount: (_b = aggregate === null || aggregate === void 0 ? void 0 : aggregate.count) !== null && _b !== void 0 ? _b : 0 }, { new: true });
    yield model_order_1.Order.updateOne({ _id: order._id, user: userId, items: { $elemMatch: eligibleItem } }, { $set: { 'items.$.isReviewed': true } });
    return updated;
});
exports.productServices = {
    createProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    updateVariant,
    addReviewRating,
};
