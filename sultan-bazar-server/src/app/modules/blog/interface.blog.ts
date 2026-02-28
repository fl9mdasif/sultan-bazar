import { Types } from 'mongoose';

export type TBlogStatus = 'DRAFT' | 'PUBLISHED';

export interface TBlog {
  // _id?: Types.ObjectId;
  title: string;
  description: string; // This will be the main content of the blog
  coverImage: string; // URL from S3
  status: TBlogStatus;
  author: Types.ObjectId; // Reference to the User who wrote it
  likes?: number;
  publishedAt?: Date;
  createdAt: Date; // Added by timestamps
  updatedAt: Date; // Added by timestamps
}