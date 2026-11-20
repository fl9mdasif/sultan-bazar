"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRateLimit = void 0;
const http_status_1 = __importDefault(require("http-status"));
const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
// Single-process baseline. Multi-instance deployments need a shared store.
const authRateLimit = (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.path}`;
    const current = attempts.get(key);
    const entry = !current || current.resetAt <= now
        ? { count: 0, resetAt: now + WINDOW_MS }
        : current;
    entry.count += 1;
    attempts.set(key, entry);
    res.setHeader('RateLimit-Reset', Math.ceil(entry.resetAt / 1000));
    if (entry.count > MAX_ATTEMPTS) {
        res.status(http_status_1.default.TOO_MANY_REQUESTS).json({
            success: false,
            statusCode: http_status_1.default.TOO_MANY_REQUESTS,
            message: 'Too many authentication attempts. Please try again later.',
            data: null,
        });
        return;
    }
    next();
};
exports.authRateLimit = authRateLimit;
