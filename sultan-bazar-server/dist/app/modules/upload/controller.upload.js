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
exports.generateUploadUrl = void 0;
const cloudinary_1 = require("cloudinary");
const http_status_1 = __importDefault(require("http-status"));
const AppErrors_1 = __importDefault(require("../../errors/AppErrors"));
const config_1 = __importDefault(require("../../config"));
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
        if (!config_1.default.cloud_name || !config_1.default.cloud_api_Key || !config_1.default.cloud_api_secret) {
            throw new AppErrors_1.default(http_status_1.default.SERVICE_UNAVAILABLE, 'Image uploads are not configured', 'Upload unavailable');
        }
        cloudinary_1.v2.config({
            cloud_name: config_1.default.cloud_name,
            api_key: config_1.default.cloud_api_Key,
            api_secret: config_1.default.cloud_api_secret,
        });
        const timestamp = Math.round(Date.now() / 1000);
        const folder = 'sultan-bazar/uploads';
        const signature = cloudinary_1.v2.utils.api_sign_request({ timestamp, folder }, config_1.default.cloud_api_secret);
        return res.status(http_status_1.default.OK).json({
            success: true,
            message: 'Upload parameters generated successfully',
            data: {
                uploadUrl: `https://api.cloudinary.com/v1_1/${config_1.default.cloud_name}/image/upload`,
                signature,
                timestamp,
                apiKey: config_1.default.cloud_api_Key,
                folder,
            },
        });
    }
    catch (error) {
        if (error instanceof AppErrors_1.default)
            return res.status(error.statusCode).json({ success: false, message: error.message });
        console.error('Cloudinary upload params generation failed');
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to generate upload parameters' });
    }
});
exports.generateUploadUrl = generateUploadUrl;
