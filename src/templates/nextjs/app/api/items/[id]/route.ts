import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { updateItemSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/items/[id] - Get a specific item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.item.findUnique({
      where: { id: parseInt(params.id) },
    });

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

// PUT /api/items/[id] - Update an item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = updateItemSchema.parse(body);

    // Update item in database
    const item = await prisma.item.update({
      where: { id: parseInt(params.id) },
      data: validatedData,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating item:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    // Prisma record not found error
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE /api/items/[id] - Delete an item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.item.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting item:', error);

    // Prisma record not found error
    if ((error as any).code === 'P2025') {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}

