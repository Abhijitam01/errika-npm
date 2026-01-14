import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createItemSchema } from '@/lib/validations';
import { z } from 'zod';

// GET /api/items - Get all items
export async function GET() {
  try {
    const items = await prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST /api/items - Create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createItemSchema.parse(body);

    // Create item in database
    const item = await prisma.item.create({
      data: validatedData,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}

