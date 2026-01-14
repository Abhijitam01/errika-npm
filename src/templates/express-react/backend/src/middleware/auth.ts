import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

interface TokenPayload {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Middleware to authenticate JWT token
 */
export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      throw new AppError('Invalid token format', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError('Invalid token', 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError('Token expired', 401));
    } else {
      next(error);
    }
  }
}

/**
 * Optional authentication - doesn't fail if no token
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        req.user = decoded;
      }
    }

    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
}

