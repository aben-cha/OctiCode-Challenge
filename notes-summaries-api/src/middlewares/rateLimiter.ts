import { Request, Response, NextFunction } from 'express';

const requests = new Map<string, number[]>();

export const rateLimiter = (limit: number = 100, windowMs: number = 60000) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const apiKey = (req.headers['x-api-key'] as string) || 'anonymous';
    const now = Date.now();

    if (!requests.has(apiKey)) {
      requests.set(apiKey, []);
    }

    const userRequests = requests.get(apiKey)!;
    const recentRequests = userRequests.filter((time) => now - time < windowMs);

    if (recentRequests.length >= limit) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
      });
    }

    recentRequests.push(now);
    requests.set(apiKey, recentRequests);

    next();
  };
};
