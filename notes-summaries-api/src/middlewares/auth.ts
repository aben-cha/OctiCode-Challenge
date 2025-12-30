import { Request, Response, NextFunction } from 'express';
import config from '../config/config';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'] as string;
  console.log(apiKey);
  if (!apiKey || apiKey !== config.apiKey) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized - Invalid or missing API key',
    });
    return;
  }

  next();
};
