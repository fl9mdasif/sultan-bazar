import { Document, Model } from 'mongoose';

export interface TCategory {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  order: number;
}

export interface TCategoryDocument extends TCategory, Document { }

export interface TCategoryModel extends Model<TCategoryDocument> { }