// lib/hooks/useSearch.ts
'use client';

import { useState } from 'react';
import type { Snippet, SearchParams } from '@/types';

export function useSearch() {
  const [results, setResults] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (params: SearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append('query', params.query);
      if (params.language) queryParams.append('language', params.language);
      if (params.categoryId) queryParams.append('categoryId', params.categoryId);
      if (params.tagIds) params.tagIds.forEach(id => queryParams.append('tagIds', id));
      if (params.isFavorite !== undefined) queryParams.append('isFavorite', String(params.isFavorite));

      const response = await fetch(`/api/search?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    results,
    loading,
    error,
    search,
  };
}

