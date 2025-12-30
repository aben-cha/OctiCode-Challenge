import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  code?: string;
  stack?: string;
}

export const errorHandler = (
  error: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('Error: ', error);

  let statusCode = 500;
  let message = 'Internal server error';

  if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
    statusCode = 404;
    message = 'Related resource not found';
  } else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};
