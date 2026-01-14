// Global type definitions

/**
 * Item type from Prisma
 */
export type Item = {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  userId: number | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * User type from Prisma
 */
export type User = {
  id: number;
  email: string;
  name: string | null;
  emailVerified: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

/**
 * API Response types
 */
export type ApiResponse<T = any> = {
  data?: T;
  error?: string;
  message?: string;
};

/**
 * Pagination types
 */
export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

/**
 * Sort order type
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Generic filter type
 */
export type Filter<T> = {
  [K in keyof T]?: T[K] | null;
};

