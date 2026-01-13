import { z } from 'zod';

export const createSnippetSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().max(500).optional(),
  code: z.string().min(1, 'Code is required'),
  language: z.string().min(1, 'Language is required'),
  tagIds: z.array(z.string()).optional(),
  notes: z.string().optional(),
  resources: z.array(z.string().url()).optional(),
  visibility: z.enum(['public', 'private', 'unlisted']).optional(),
});

export const updateSnippetSchema = createSnippetSchema.partial().extend({
  isFavorite: z.boolean().optional(),
});

export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
});

export const updateTagSchema = createTagSchema.partial();

export const snippetSchema = createSnippetSchema;
export const tagSchema = createTagSchema;

export const searchSchema = z.object({
  query: z.string().optional(),
  language: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
  isFavorite: z.boolean().optional(),
});