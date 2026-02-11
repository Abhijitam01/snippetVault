'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSnippets } from '@/lib/hooks/useSnippets';
import MainLayout from '@/components/layout/MainLayout';
import SnippetList from '@/components/snippets/SnippetList';
import { cn } from '@/lib/utils';
import { useSearch } from '@/lib/hooks/useSearch';
import { useTags } from '@/lib/hooks/useTags';
import { useAuth } from '@/lib/hooks/useAuth';
import Button from '@/components/ui/Button';
import TagBadge from '@/components/ui/TagBadge';
import StatsCard from '@/components/ui/StatsCard';
import toast from 'react-hot-toast';
import type { Tag } from '@/types';

import { Code2, Star, Terminal, Plus } from 'lucide-react';

const LANGUAGES = [
  'typescript', 'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css',
  'sql', 'yaml', 'json', 'markdown', 'bash', 'shell'
];

const Stats = ({ snippets, tags }: { snippets: any[], tags: any[] }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 w-full md:w-auto">
    <StatsCard
      title="Snippets"
      value={snippets.length}
      icon={<Code2 className="w-4 h-4" />}
      className="bg-white dark:bg-zinc-950/50 border-gray-200 dark:border-white/10"
    />
    <StatsCard
      title="Tags"
      value={tags.length}
      icon={<Terminal className="w-4 h-4" />}
      className="bg-white dark:bg-zinc-950/50 border-gray-200 dark:border-white/10"
    />
    <StatsCard
      title="Favorites"
      value={snippets.filter((s) => s.isFavorite).length}
      icon={<Star className="w-4 h-4" />}
      className="bg-white dark:bg-zinc-950/50 border-gray-200 dark:border-white/10"
    />
  </div>
);

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
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center transition-colors duration-300">
        <div className="text-gray-400 dark:text-white/50 font-mono">Loading...</div>
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
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between py-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-white/50 font-mono">
              Manage and organize your personal code vault.
            </p>
          </div>
          <Stats snippets={snippets} tags={tags} />
        </div>

        {/* Filters */}
        <section className="rounded-xl border border-gray-200 dark:border-white/10 bg-white/50 dark:bg-zinc-950/50 p-4 md:p-6 backdrop-blur-sm transition-colors duration-300">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white font-mono uppercase tracking-wider">Filters</h2>
              <p className="text-xs text-gray-500 dark:text-white/50 font-mono">Narrow down results instantly.</p>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-500/10">
                Clear Filters
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2 font-mono uppercase tracking-tight">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-zinc-900/90 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 font-mono transition-all"
              >
                <option value="">All languages</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang} className="bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            {tags.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 dark:text-white/60 mb-2 font-mono uppercase tracking-tight">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn("transition-all",
                        filters.tagIds.includes(tag.id)
                          ? 'opacity-100 scale-105'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      )}
                    >
                      <TagBadge tag={tag} />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/10">
            <label className="inline-flex items-center gap-3 text-sm text-gray-600 dark:text-white/80 cursor-pointer font-mono hover:text-gray-900 dark:hover:text-white transition-colors group">
              <input
                type="checkbox"
                checked={filters.isFavorite}
                onChange={(e) => setFilters({ ...filters, isFavorite: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-zinc-900/90 text-violet-600 focus:ring-violet-500/40"
              />
              <span className="flex items-center gap-2">
                <Star className={cn("w-4 h-4 transition-colors", filters.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400 group-hover:text-yellow-400")} />
                Favorites only
              </span>
            </label>
          </div>
        </section>

        {/* Snippets List */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between gap-3 px-2">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-mono tracking-tight">Your Vault</h2>
              <p className="text-xs text-gray-500 dark:text-white/50 font-mono">Everything you have saved.</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-mono text-gray-400 dark:text-white/40 bg-gray-100 dark:bg-white/5 px-2 py-1 rounded">
                {displaySnippets.length} {displaySnippets.length === 1 ? 'snippet' : 'snippets'}
              </span>
              <Button 
                onClick={() => router.push('/snippets/new')}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Snippet</span>
              </Button>
            </div>
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
