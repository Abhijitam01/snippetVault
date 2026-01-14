'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SnippetViewer from '@/components/snippets/SnippetViewer';
import MainLayout from '@/components/layout/MainLayout';
import type { Snippet } from '@/types';
import { useSnippets } from '@/lib/hooks/useSnippets';
import toast from 'react-hot-toast';

export default function SnippetPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { deleteSnippet } = useSnippets();
  const [snippet, setSnippet] = useState<Snippet | null>(null);

  useEffect(() => {
    fetch(`/api/snippets/${id}`)
      .then((res) => res.json())
      .then(setSnippet)
      .catch(() => {
        toast.error('Failed to load snippet');
        router.push('/dashboard');
      });
  }, [id, router]);

  const handleEdit = () => {
    router.push(`/snippets/${id}/edit`);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this snippet?')) {
      try {
        await deleteSnippet(id);
        toast.success('Snippet deleted');
        router.push('/dashboard');
      } catch {
        toast.error('Failed to delete snippet');
      }
    }
  };

  if (!snippet) {
    return (
      <MainLayout onSearch={() => {}}>
        <div>Loading...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout onSearch={() => {}}>
      <SnippetViewer snippet={snippet} onEdit={handleEdit} onDelete={handleDelete} shareMode={true} />
    </MainLayout>
  );
}

