import { Schema, model } from 'mongoose';

const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },        // "Cooking Oil"
    slug: { type: String, required: true, unique: true },      // "cooking-oil"
    description: { type: String },
    isActive: { type: Boolean, default: true },
    // order: { type: Number, default: 0 },  // for manual sorting in UI
    // image: { type: String },                                   // category banner/icon
    // Self-referencing for nested categories
    // parent: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    // null = top-level category
  },
  { timestamps: true }
);

categorySchema.index({ slug: 1 });
// categorySchema.index({ parent: 1 });

export const Category = model('Category', categorySchema);
