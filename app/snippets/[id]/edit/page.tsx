'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSnippets } from '@/lib/hooks/useSnippets';
import { useTags } from '@/lib/hooks/useTags';
import MainLayout from '@/components/layout/MainLayout';
import SnippetForm from '@/components/snippets/SnippetForm';
import type { SnippetFormData } from '@/types';
import toast from 'react-hot-toast';

export default function EditSnippetPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { snippets, updateSnippet } = useSnippets();
  const { tags } = useTags();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<Partial<SnippetFormData>>();

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
              notes: snippet.notes || '',
              resources: snippet.resources ? JSON.parse(snippet.resources) : [],
              isFavorite: snippet.isFavorite,
            });
          })
          .catch(() => {
            toast.error('Failed to load snippet');
            router.push('/dashboard');
          });
      }
    }
  }, [snippets, id, router]);

  const handleSubmit = async (data: SnippetFormData) => {
    try {
      setLoading(true);
      await updateSnippet(id, data as any);
      toast.success('Snippet updated successfully!');
      router.push(`/snippets/${id}`);
    } catch {
      toast.error('Failed to update snippet');
    } finally {
      setLoading(false);
    }
  };

  if (!initialData) {
    return (
      <MainLayout onSearch={() => {}}>
        <div className="max-w-4xl mx-auto">Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout onSearch={() => {}}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Edit snippet</h1>
          <p className="mt-1 text-sm text-white/60">Tweak the code or metadata, then save.</p>
        </div>
        <SnippetForm
          initialData={initialData}
          tags={tags}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}
