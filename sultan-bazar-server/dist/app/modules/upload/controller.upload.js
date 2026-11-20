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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUploadUrl = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const http_status_1 = __importDefault(require("http-status"));
const uuid_1 = require("uuid");
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const s3Client = new client_s3_1.S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: (_a = process.env.AWS_ACCESS_KEY_ID) !== null && _a !== void 0 ? _a : '',
        secretAccessKey: (_b = process.env.AWS_SECRET_ACCESS_KEY) !== null && _b !== void 0 ? _b : '',
    },
});
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const generateUploadUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filename, contentType, contentLength } = req.body;
        if (typeof filename !== 'string' || typeof contentType !== 'string' || typeof contentLength !== 'number') {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'filename, contentType, and contentLength are required', 'Invalid upload request');
        }
        if (!ALLOWED_IMAGE_TYPES.has(contentType) || contentLength < 1 || contentLength > MAX_IMAGE_BYTES) {
            throw new AppErrors_1.default(http_status_1.default.BAD_REQUEST, 'Only JPEG, PNG, or WebP images up to 5 MB are allowed', 'Invalid upload file');
        }
        const bucket = process.env.AWS_S3_BUCKET_NAME;
        const region = process.env.AWS_S3_REGION;
        if (!bucket || !region) {
            throw new AppErrors_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Image uploads are not configured', 'Upload unavailable');
        }
        const safeFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '-').slice(-100);
        const key = `uploads/images/${(0, uuid_1.v4)()}-${safeFilename}`;
        const command = new client_s3_1.PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType, ContentLength: contentLength });
        const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, command, { expiresIn: 600 });
        const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
        return res.status(http_status_1.default.OK).json({ success: true, message: 'Upload URL generated successfully', data: { uploadUrl, fileUrl } });
    }
    catch (error) {
        if (error instanceof AppErrors_1.default)
            return res.status(error.statusCode).json({ success: false, message: error.message });
        console.error('Image upload URL generation failed');
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to generate upload URL' });
    }
});
exports.generateUploadUrl = generateUploadUrl;
