'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSnippets } from '@/lib/hooks/useSnippets';
import MainLayout from '@/components/layout/MainLayout';
import SnippetList from '@/components/snippets/SnippetList';
import { useSearch } from '@/lib/hooks/useSearch';
import { useTags } from '@/lib/hooks/useTags';
import { useAuth } from '@/lib/hooks/useAuth';
import Button from '@/components/ui/Button';
import TagBadge from '@/components/ui/TagBadge';
import StatsCard from '@/components/ui/StatsCard';
import toast from 'react-hot-toast';
import type { Tag } from '@/types';

const LANGUAGES = [
  'typescript', 'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css',
  'sql', 'yaml', 'json', 'markdown', 'bash', 'shell'
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { snippets, loading } = useSnippets();
  const { search, results, loading: searchLoading } = useSearch();
  const { tags } = useTags();
  const [stats, setStats] = useState({
    totalSnippets: 0,
    totalTags: 0,
    favorites: 0,
  });
  const [filters, setFilters] = useState({
    language: '',
    tagIds: [] as string[],
    isFavorite: false,
  });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    setStats({
      totalSnippets: snippets.length,
      totalTags: tags.length,
      favorites: snippets.filter((s) => s.isFavorite).length,
    });
  }, [snippets, tags]);

  useEffect(() => {
    const active =
      filters.language ||
      filters.tagIds.length > 0 ||
      filters.isFavorite;
    setHasActiveFilters(!!active);

    if (active) {
      search({
        language: filters.language || undefined,
        tagIds: filters.tagIds.length > 0 ? filters.tagIds : undefined,
        isFavorite: filters.isFavorite || undefined,
      });
    } else {
      // Clear results when no filters are active
      search({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      search({ query, ...filters });
    } else if (hasActiveFilters) {
      search(filters);
    } else {
      // Clear search results when query is empty and no filters
      search({});
    }
  }, [search, filters, hasActiveFilters]);

  const clearFilters = () => {
    setFilters({
      language: '',
      tagIds: [],
      isFavorite: false,
    });
  };

  const toggleTag = (tagId: string) => {
    setFilters((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  // Show results if we have search results or active filters, otherwise show all snippets
  // Use useMemo to prevent unnecessary re-calculations
  const displaySnippets = useMemo(() => 
    (results.length > 0 || hasActiveFilters) ? results : snippets,
    [results, snippets, hasActiveFilters]
  );

  // Show loading only while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white/50 font-mono">Loading...</div>
      </div>
    );
  }

  // If not authenticated, return null (redirect will happen via useEffect)
  if (!user) {
    return null;
  }

  return (
      <MainLayout onSearch={handleSearch}>
        <div className="space-y-6">
        {/* Top row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white font-mono">Dashboard</h1>
            <p className="mt-1 text-sm text-white/50 font-mono">
              Overview of your snippets, categories and tags.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 w-full md:w-auto">
            <StatsCard title="Snippets" value={stats.totalSnippets} />
            <StatsCard title="Tags" value={stats.totalTags} />
            <StatsCard title="Favorites" value={stats.favorites} />
          </div>
        </div>

        {/* Filters */}
        <section className="rounded-lg border border-white/10 bg-zinc-950/80 p-4 md:p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white font-mono">Filters</h2>
              <p className="text-xs text-white/50 font-mono">Narrow down snippets by language and tags.</p>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear
              </Button>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-white/60 mb-2 font-mono">Language</label>
            <select
              value={filters.language}
              onChange={(e) => setFilters({ ...filters, language: e.target.value })}
              className="w-full rounded-md border border-white/10 bg-zinc-900/90 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/60 focus:border-blue-500/60 font-mono"
            >
              <option value="">All languages</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang} className="bg-zinc-900">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {tags.length > 0 && (
            <div className="mt-4">
              <label className="block text-xs font-medium text-white/60 mb-2 font-mono">Tags</label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`transition-all ${
                      filters.tagIds.includes(tag.id)
                        ? 'opacity-100 scale-105'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                  >
                    <TagBadge tag={tag} />
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 pt-4 border-t border-white/10">
            <label className="inline-flex items-center gap-2 text-sm text-white/80 cursor-pointer font-mono hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={filters.isFavorite}
                onChange={(e) => setFilters({ ...filters, isFavorite: e.target.checked })}
                className="h-4 w-4 rounded border-white/20 bg-zinc-900/90 text-blue-500 focus:ring-blue-500/60"
              />
              <span>Favorites only</span>
            </label>
          </div>
        </section>

        {/* Snippets List */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white font-mono">All snippets</h2>
              <p className="text-xs text-white/50 font-mono">Everything you have saved, filtered above.</p>
            </div>
            <span className="text-xs text-white/60 whitespace-nowrap">
              {displaySnippets.length} snippet{displaySnippets.length === 1 ? '' : 's'}
            </span>
          </div>
          <SnippetList
            snippets={displaySnippets}
            loading={loading || searchLoading}
          />
        </section>
      </div>
    </MainLayout>
  );
}
