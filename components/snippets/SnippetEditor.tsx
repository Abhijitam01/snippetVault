'use client';

import SnippetForm from './SnippetForm';
import type { SnippetFormData, Tag } from '@/types';

interface SnippetEditorProps {
  initialData?: Partial<SnippetFormData>;
  tags: Tag[];
  onSubmit: (data: SnippetFormData) => void;
  onCancel?: () => void;
  loading?: boolean;
}

export default function SnippetEditor({
  initialData,
  tags,
  onSubmit,
  onCancel,
  loading,
}: SnippetEditorProps) {
  return (
    <SnippetForm
      initialData={initialData}
      tags={tags}
      onSubmit={onSubmit}
      onCancel={onCancel}
      loading={loading}
    />
  );
}

