import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';

type RateLimitEntry = { count: number; resetAt: number };

const attempts = new Map<string, RateLimitEntry>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;

// Single-process baseline. Multi-instance deployments need a shared store.
export const authRateLimit = (req: Request, res: Response, next: NextFunction) => {
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
    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      statusCode: httpStatus.TOO_MANY_REQUESTS,
      message: 'Too many authentication attempts. Please try again later.',
      data: null,
    });
    return;
  }

  next();
};
