/**
 * Shared TypeScript types
 */

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  id: number;
  title: string;
  description?: string | null;
  completed: boolean;
  userId?: number | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name?: string;
    email: string;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface ItemsResponse {
  items: Item[];
}

export interface ItemResponse {
  item: Item;
}

