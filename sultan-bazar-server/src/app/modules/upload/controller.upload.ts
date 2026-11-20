import { Request, Response } from 'express';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import AppError from '../../errors/AppErrors';

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
  },
});

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const generateUploadUrl = async (req: Request, res: Response) => {
  try {
    const { filename, contentType, contentLength } = req.body as {
      filename?: unknown;
      contentType?: unknown;
      contentLength?: unknown;
    };
    if (typeof filename !== 'string' || typeof contentType !== 'string' || typeof contentLength !== 'number') {
      throw new AppError(httpStatus.BAD_REQUEST, 'filename, contentType, and contentLength are required', 'Invalid upload request');
    }
    if (!ALLOWED_IMAGE_TYPES.has(contentType) || contentLength < 1 || contentLength > MAX_IMAGE_BYTES) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Only JPEG, PNG, or WebP images up to 5 MB are allowed', 'Invalid upload file');
    }

    const bucket = process.env.AWS_S3_BUCKET_NAME;
    const region = process.env.AWS_S3_REGION;
    if (!bucket || !region) {
      throw new AppError(httpStatus.SERVICE_UNAVAILABLE, 'Image uploads are not configured', 'Upload unavailable');
    }

    const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '-').slice(-100);
    const key = `uploads/images/${uuidv4()}-${safeFilename}`;
    const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ContentLength: contentLength });
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    return res.status(httpStatus.OK).json({ success: true, message: 'Upload URL generated successfully', data: { uploadUrl, fileUrl } });
  } catch (error: unknown) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, message: error.message });
    console.error('Image upload URL generation failed');
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to generate upload URL' });
  }
};
