import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const windowMs = 15 * 60 * 1000; // 15 minutes
const maxRequests = 30; // Max requests per window
const store = new Map<string, RateLimitStore>();

export const authRateLimiter = (req: Request, res: Response, next: NextFunction): void => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = store.get(ip);

  if (!record) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (now > record.resetTime) {
    store.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  record.count += 1;

  if (record.count > maxRequests) {
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts. Please try again in 15 minutes.',
    });
    return;
  }

  next();
};
