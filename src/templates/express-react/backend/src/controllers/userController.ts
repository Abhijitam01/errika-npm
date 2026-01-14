import { Request, Response } from 'express';
import { prisma } from '../services/db';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';

/**
 * Get all users
 */
export async function getAllUsers(req: Request, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ users });
  } catch (error) {
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
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

/**
 * Update user
 */
export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const currentUserId = (req as any).user?.userId;

    // Check if user is updating their own profile
    if (parseInt(id) !== currentUserId) {
      throw new AppError('Not authorized to update this user', 403);
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        updatedAt: true,
      },
    });

    res.json({ user });
  } catch (error) {
    throw error;
  }
}

/**
 * Delete user
 */
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const currentUserId = (req as any).user?.userId;

    // Check if user is deleting their own account
    if (parseInt(id) !== currentUserId) {
      throw new AppError('Not authorized to delete this user', 403);
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    throw error;
  }
}

