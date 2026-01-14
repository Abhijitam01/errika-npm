import { Request, Response } from 'express';
import { prisma } from '../services/db';
import { AppError } from '../middleware/errorHandler';

/**
 * Get all items
 */
export async function getAllItems(req: Request, res: Response) {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ items });
  } catch (error) {
    throw error;
  }
}

/**
 * Get item by ID
 */
export async function getItemById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const item = await prisma.item.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!item) {
      throw new AppError('Item not found', 404);
    }

    res.json({ item });
  } catch (error) {
    throw error;
  }
}

/**
 * Create new item
 */
export async function createItem(req: Request, res: Response) {
  try {
    const { title, description } = req.body;
    const userId = (req as any).user?.userId;

    const item = await prisma.item.create({
      data: {
        title,
        description,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({ item });
  } catch (error) {
    throw error;
  }
}

/**
 * Update item
 */
export async function updateItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    const userId = (req as any).user?.userId;

    // Check if item exists and belongs to user
    const existingItem = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      throw new AppError('Item not found', 404);
    }

    if (existingItem.userId !== userId) {
      throw new AppError('Not authorized to update this item', 403);
    }

    const item = await prisma.item.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(completed !== undefined && { completed }),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({ item });
  } catch (error) {
    throw error;
  }
}

/**
 * Delete item
 */
export async function deleteItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.userId;

    // Check if item exists and belongs to user
    const existingItem = await prisma.item.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingItem) {
      throw new AppError('Item not found', 404);
    }

    if (existingItem.userId !== userId) {
      throw new AppError('Not authorized to delete this item', 403);
    }

    await prisma.item.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    throw error;
  }
}
