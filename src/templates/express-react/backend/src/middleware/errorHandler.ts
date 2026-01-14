import { Request, Response, NextFunction } from 'express';

/**
 * Custom error class
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 */
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  // Default error values
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: any = undefined;

  // Handle known errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    
    switch (prismaError.code) {
      case 'P2002':
        statusCode = 400;
        message = 'A record with this value already exists';
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Record not found';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Foreign key constraint failed';
        break;
      default:
        statusCode = 400;
        message = 'Database operation failed';
    }
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = (err as any).errors;
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = (err as any).errors;
  }

  // Send error response
  res.status(statusCode).json({
    error: message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err,
    }),
  });
}

/**
 * Handle 404 errors
 */
export function notFound(req: Request, res: Response, next: NextFunction) {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
}

/**
 * Async handler wrapper to catch async errors
 */
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

