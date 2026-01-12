// components/snippets/SnippetEditor.tsx
'use client';

import SnippetForm from './SnippetForm';
import type { SnippetFormData, Tag, Category } from '@/types';

interface SnippetEditorProps {
  initialData?: Partial<SnippetFormData>;
  tags: Tag[];
  categories: Category[];
  onSubmit: (data: SnippetFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function SnippetEditor({
  initialData,
  tags,
  categories,
  onSubmit,
  onCancel,
  loading,
}: SnippetEditorProps) {
  return (
    <SnippetForm
      initialData={initialData}
      tags={tags}
      categories={categories}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    />
  );
}

