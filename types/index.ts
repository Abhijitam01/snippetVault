import { Snippet as PrismaSnippet, Tag, Category } from '@prisma/client';

export type { Tag, Category };

export type SnippetWithRelations = PrismaSnippet & {
  tags: Tag[];
  category: Category | null;
};

export type Snippet = SnippetWithRelations;

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

export type SearchParams = SearchFilters;

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