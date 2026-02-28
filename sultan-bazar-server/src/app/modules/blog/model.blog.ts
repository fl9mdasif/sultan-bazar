import { Schema, model } from 'mongoose';
import { TBlog } from './interface.blog';

const blogSchema = new Schema<TBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED'],
      default: 'DRAFT',
    },
   author: {
      type: Schema.Types.ObjectId,
      ref: 'User', // Assumes your User model is named 'User'
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      // default: null,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

export const Blog = model<TBlog>('Blog', blogSchema);