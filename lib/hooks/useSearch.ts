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
      
      // If no search params at all, clear results
      const hasAnyParams = params.query || params.language || 
                          (params.tagIds && params.tagIds.length > 0) || 
                          params.isFavorite !== undefined;
      
      if (!hasAnyParams) {
        setResults([]);
        setLoading(false);
        return;
      }

      const queryParams = new URLSearchParams();
      if (params.query) queryParams.append('query', params.query);
      if (params.language) queryParams.append('language', params.language);
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

