"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageUploads = void 0;
const authorize_1 = __importDefault(require("../../middlewares/authorize"));
const controller_upload_1 = require("./controller.upload");
const express_1 = require("express");
// import { generateUploadUrl } from '../controllers/upload.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // Import your authentication middleware
const router = (0, express_1.Router)();
// This endpoint MUST be protected so only logged-in admins can use it
router.post('/generate-upload-url', (0, authorize_1.default)('manageCatalog'), controller_upload_1.generateUploadUrl);
exports.ImageUploads = router;
