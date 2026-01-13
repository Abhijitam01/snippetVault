'use client';

import { useState, useEffect } from 'react';
import type { Snippet } from '@/types';

export function useSnippets() {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSnippets = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      // Get current user ID from session
      const sessionRes = await fetch('/api/auth/session');
      const sessionData = await sessionRes.json();
      const userId = sessionData.user?.id;
      
      // Only fetch user's own snippets if authenticated
      const url = userId 
        ? `/api/snippets?page=${page}&limit=${limit}&userId=${userId}`
        : `/api/snippets?page=${page}&limit=${limit}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch snippets');
      const data = await response.json();
      // Handle both old format (array) and new format (object with pagination)
      if (Array.isArray(data)) {
        setSnippets(data);
      } else {
        setSnippets(data.snippets || []);
      }
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

