import { PrismaClient } from '@prisma/client';
import { logger } from '../src/utils/logger';

/**
 * Global Prisma client instance
 * Uses singleton pattern to prevent multiple instances
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Connect to the database
 */
export async function connectDatabase() {
  try {
    await prisma.$connect();
    logger.success('Database connected successfully');
  } catch (error) {
    logger.error('Failed to connect to database:', error as Error);
    throw error;
  }
}

/**
 * Disconnect from the database
 */
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  } catch (error) {
    logger.error('Error disconnecting from database:', error as Error);
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await disconnectDatabase();
});

