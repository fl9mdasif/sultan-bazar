import { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import httpStatus from 'http-status';
import AppError from '../../errors/AppErrors';
import config from '../../config';

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
    if (!config.cloud_name || !config.cloud_api_Key || !config.cloud_api_secret) {
      throw new AppError(httpStatus.SERVICE_UNAVAILABLE, 'Image uploads are not configured', 'Upload unavailable');
    }

    cloudinary.config({
      cloud_name: config.cloud_name as string,
      api_key: config.cloud_api_Key as string,
      api_secret: config.cloud_api_secret as string,
    });

    const timestamp = Math.round(Date.now() / 1000);
    const folder = 'sultan-bazar/uploads';
    const signature = cloudinary.utils.api_sign_request(
      { timestamp, folder },
      config.cloud_api_secret as string
    );

    return res.status(httpStatus.OK).json({
      success: true,
      message: 'Upload parameters generated successfully',
      data: {
        uploadUrl: `https://api.cloudinary.com/v1_1/${config.cloud_name}/image/upload`,
        signature,
        timestamp,
        apiKey: config.cloud_api_Key,
        folder,
      },
    });
  } catch (error: unknown) {
    if (error instanceof AppError) return res.status(error.statusCode).json({ success: false, message: error.message });
    console.error('Cloudinary upload params generation failed');
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to generate upload parameters' });
  }
};
