// app/snippets/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnippets } from '@/lib/hooks/useSnippets';
import { useTags } from '@/lib/hooks/useTags';
import SnippetForm from '@/components/snippets/SnippetForm';
import type { SnippetFormData, Category } from '@/types';
import toast from 'react-hot-toast';

export default function NewSnippetPage() {
  const router = useRouter();
  const { createSnippet } = useSnippets();
  const { tags } = useTags();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  const handleSubmit = async (data: SnippetFormData) => {
    try {
      setLoading(true);
      await createSnippet(data);
      toast.success('Snippet created successfully!');
      router.push('/');
    } catch {
      toast.error('Failed to create snippet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Snippet</h1>
      <SnippetForm
        tags={tags}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        loading={loading}
      />
    </div>
  );
}

