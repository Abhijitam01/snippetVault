// app/snippets/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSnippets } from '@/lib/hooks/useSnippets';
import { useTags } from '@/lib/hooks/useTags';
import SnippetForm from '@/components/snippets/SnippetForm';
import type { SnippetFormData, Category } from '@/types';
import toast from 'react-hot-toast';

export default function EditSnippetPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { snippets, updateSnippet } = useSnippets();
  const { tags } = useTags();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<SnippetFormData>>();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then(setCategories);
  }, []);

  useEffect(() => {
    if (snippets.length > 0) {
      const snippet = snippets.find((s) => s.id === id);
      if (snippet) {
        setInitialData({
          title: snippet.title,
          description: snippet.description || '',
          code: snippet.code,
          language: snippet.language,
          tagIds: snippet.tags.map((t: { id: string }) => t.id),
          categoryId: snippet.categoryId || undefined,
          notes: snippet.notes || '',
          resources: snippet.resources ? JSON.parse(snippet.resources) : [],
          isFavorite: snippet.isFavorite,
        });
      } else {
        // Fetch snippet if not in list
        fetch(`/api/snippets/${id}`)
          .then((res) => res.json())
          .then((snippet) => {
            setInitialData({
              title: snippet.title,
              description: snippet.description || '',
              code: snippet.code,
              language: snippet.language,
              tagIds: snippet.tags.map((t: { id: string }) => t.id),
              categoryId: snippet.categoryId || undefined,
              notes: snippet.notes || '',
              resources: snippet.resources ? JSON.parse(snippet.resources) : [],
              isFavorite: snippet.isFavorite,
            });
          })
          .catch(() => {
            toast.error('Failed to load snippet');
            router.push('/');
          });
      }
    }
  }, [snippets, id, router]);

  const handleSubmit = async (data: SnippetFormData) => {
    try {
      setLoading(true);
      await updateSnippet(id, data);
      toast.success('Snippet updated successfully!');
      router.push(`/snippets/${id}`);
    } catch {
      toast.error('Failed to update snippet');
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Edit Snippet</h1>
      <SnippetForm
        initialData={initialData}
        tags={tags}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        loading={loading}
      />
    </div>
  );
}

