import { NextFunction, Request, Response } from 'express';

export interface AppError extends Error {
  status?: number;
}

// export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
//   console.error(err);
//   const status = err.status || 500;

//   res.status(status).json({
//     success: false,
//     error: err.message || 'Internal Server Error',
//   });
// };

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
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
