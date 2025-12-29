import { NextFunction, Request, Response } from 'express';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error',
  });
};
