// types/index.ts
import { Snippet as PrismaSnippet, Tag, Category } from '@prisma/client';

// Re-export Prisma types
export type { Tag, Category };

// Extended types with relations
export type SnippetWithRelations = PrismaSnippet & {
  tags: Tag[];
  category: Category | null;
};

// Type alias - Snippet typically refers to snippets with relations in the app
export type Snippet = SnippetWithRelations;

// DTOs for API requests
export interface CreateSnippetDTO {
  title: string;
  description?: string;
  code: string;
  language: string;
  tagIds?: string[];
  categoryId?: string;
  notes?: string;
  resources?: string[];
}

export interface UpdateSnippetDTO extends Partial<CreateSnippetDTO> {
  isFavorite?: boolean;
}

export interface SearchFilters {
  query?: string;
  language?: string;
  tagIds?: string[];
  categoryId?: string;
  isFavorite?: boolean;
}

// Alias for SearchParams (used in hooks)
export type SearchParams = SearchFilters;

// Form data type for snippet forms
export interface SnippetFormData {
  title: string;
  description?: string;
  code: string;
  language: string;
  tagIds: string[];
  categoryId?: string;
  notes?: string;
  resources: string[];
  isFavorite?: boolean;
}

export interface CreateTagDTO {
  name: string;
  color?: string;
}

export interface CreateCategoryDTO {
  name: string;
  description?: string;
  icon?: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}