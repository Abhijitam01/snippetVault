// lib/validations.ts
import { z } from 'zod';

export const createSnippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(500).optional(),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  tagIds: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  notes: z.string().optional(),
  resources: z.array(z.string().url()).optional(),
});

export const updateSnippetSchema = createSnippetSchema.partial().extend({
  isFavorite: z.boolean().optional(),
});

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().max(10).optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const updateTagSchema = createTagSchema.partial();

// Aliases for backward compatibility (deprecated - use create/update versions)
export const snippetSchema = createSnippetSchema;
export const categorySchema = createCategorySchema;
export const tagSchema = createTagSchema;

export const searchSchema = z.object({
  query: z.string().optional(),
  language: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  categoryId: z.string().optional(),
  isFavorite: z.boolean().optional(),
});