'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSnippets } from '@/lib/hooks/useSnippets';
import { useTags } from '@/lib/hooks/useTags';
import MainLayout from '@/components/layout/MainLayout';
import SnippetForm from '@/components/snippets/SnippetForm';
import type { SnippetFormData } from '@/types';
import toast from 'react-hot-toast';

export default function NewSnippetPage() {
  const router = useRouter();
  const { createSnippet } = useSnippets();
  const { tags } = useTags();
  const [loading, setLoading] = useState(false);

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
    <MainLayout onSearch={() => {}}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="py-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">New snippet</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-white/60 font-mono">Save a reusable piece of code to your vault.</p>
        </div>
        <SnippetForm
          tags={tags}
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}
