"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Review = void 0;
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    product: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    order: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Order', required: true },
    variantId: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true });
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
exports.Review = (0, mongoose_1.model)('Review', reviewSchema);
