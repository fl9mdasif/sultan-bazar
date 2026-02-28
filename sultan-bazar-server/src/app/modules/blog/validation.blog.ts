import { z } from 'zod';

const createBlogValidationSchema = z.object({
  body: z.object({
    title: z.string({ message: 'Title is required' }),
    description: z.string({ message: 'Description is required' }),
    coverImage: z
      .string({ message: 'Cover image URL is required' })
      .url(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional().default('DRAFT'),
    // author will be added from the authenticated user (req.user)
  }),
});

const updateBlogValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    coverImage: z.string().url().optional(),
    status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
    likes: z.number().min(0).optional(),
    publishedAt: z.date().optional(),
  }),
});

export const BlogValidations = {
  createBlogValidationSchema,
  updateBlogValidationSchema,
};