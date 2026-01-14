import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/db';
import { AppError } from '../middleware/errorHandler';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

interface TokenPayload {
  userId: number;
  email: string;
}

/**
 * Generate JWT token
 */
function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Register new user
 */
export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('User already exists with this email', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Login user
 */
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // Generate token
    const token = generateToken({ userId: user.id, email: user.email });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Refresh token
 */
export async function refreshToken(req: Request, res: Response) {
  try {
    const { token } = req.body;

    if (!token) {
      throw new AppError('Token is required', 400);
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Generate new token
    const newToken = generateToken({
      userId: decoded.userId,
      email: decoded.email,
    });

    res.json({ token: newToken });
  } catch (error) {
    throw new AppError('Invalid or expired token', 401);
  }
}

/**
 * Get current user
 */
export async function getCurrentUser(req: Request, res: Response) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.json({ user });
  } catch (error) {
    throw error;
  }
}

