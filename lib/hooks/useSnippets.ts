'use client';

import { useState, useEffect } from 'react';
import type { Snippet } from '@/types';

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/snippets');
      if (!response.ok) throw new Error('Failed to fetch snippets');
      const data = await response.json();
      setSnippets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSnippets();
  }, []);

  const createSnippet = async (snippet: Partial<Snippet>) => {
    try {
      const response = await fetch('/api/snippets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snippet),
      });
      if (!response.ok) throw new Error('Failed to create snippet');
      await fetchSnippets();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateSnippet = async (id: string, snippet: Partial<Snippet>) => {
    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snippet),
      });
      if (!response.ok) throw new Error('Failed to update snippet');
      await fetchSnippets();
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete snippet');
      await fetchSnippets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return {
    snippets,
    loading,
    error,
    refetch: fetchSnippets,
    createSnippet,
    updateSnippet,
    deleteSnippet,
  };
}

