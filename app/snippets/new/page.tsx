'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSnippets } from '@/lib/hooks/useSnippets';
import { useTags } from '@/lib/hooks/useTags';
import MainLayout from '@/components/layout/MainLayout';
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
      await createSnippet(data as any);
      toast.success('Snippet created successfully!');
      router.push('/dashboard');
    } catch {
      toast.error('Failed to create snippet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout categories={categories} onSearch={() => {}}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">New snippet</h1>
          <p className="mt-1 text-sm text-white/60">Save a reusable piece of code to your vault.</p>
        </div>
        <SnippetForm
          tags={tags}
          categories={categories}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}
