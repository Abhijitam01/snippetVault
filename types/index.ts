import { Snippet as PrismaSnippet, Tag } from '@prisma/client';

export type { Tag };

export type SnippetWithRelations = PrismaSnippet & {
  tags: Tag[];
};

export type Snippet = SnippetWithRelations;

export interface CreateSnippetDTO {
  title: string;
  description?: string;
  code: string;
  language: string;
  tagIds?: string[];
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
  isFavorite?: boolean;
}

export type SearchParams = SearchFilters;

export interface SnippetFormData {
  title: string;
  description?: string;
  code: string;
  language: string;
  tagIds: string[];
  notes?: string;
  resources: string[];
  isFavorite?: boolean;
  visibility?: 'public' | 'private' | 'unlisted';
}

export interface CreateTagDTO {
  name: string;
  color?: string;
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