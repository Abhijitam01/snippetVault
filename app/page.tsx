// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSnippets } from '@/lib/hooks/useSnippets';
import MainLayout from '@/components/layout/MainLayout';
import SnippetList from '@/components/snippets/SnippetList';
import { useSearch } from '@/lib/hooks/useSearch';
import { useTags } from '@/lib/hooks/useTags';
import Button from '@/components/ui/Button';
import TagBadge from '@/components/ui/TagBadge';
import type { Category, Tag } from '@/types';

const LANGUAGES = [
  'typescript', 'javascript', 'python', 'java', 'cpp', 'c', 'csharp',
  'go', 'rust', 'php', 'ruby', 'swift', 'kotlin', 'html', 'css',
  'sql', 'yaml', 'json', 'markdown', 'bash', 'shell'
];

export default function HomePage() {
  const { snippets, loading } = useSnippets();
  const { search, results, loading: searchLoading } = useSearch();
  const { tags } = useTags();
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({
    totalSnippets: 0,
    totalCategories: 0,
    totalTags: 0,
    favorites: 0,
  });
  const [filters, setFilters] = useState({
    language: '',
    categoryId: '',
    tagIds: [] as string[],
    isFavorite: false,
  });
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setStats((prev) => ({ ...prev, totalCategories: data.length }));
      });

    fetch('/api/tags')
      .then((res) => res.json())
      .then((data) => {
        setStats((prev) => ({ ...prev, totalTags: data.length }));
      });
  }, []);

  useEffect(() => {
    setStats({
      totalSnippets: snippets.length,
      totalCategories: categories.length,
      totalTags: tags.length,
      favorites: snippets.filter((s) => s.isFavorite).length,
    });
  }, [snippets, categories, tags]);

  useEffect(() => {
    const active =
      filters.language ||
      filters.categoryId ||
      filters.tagIds.length > 0 ||
      filters.isFavorite;
    setHasActiveFilters(!!active);

    if (active) {
      search({
        language: filters.language || undefined,
        categoryId: filters.categoryId || undefined,
        tagIds: filters.tagIds.length > 0 ? filters.tagIds : undefined,
        isFavorite: filters.isFavorite || undefined,
      });
    }
  }, [filters]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      search({ query, ...filters });
    } else if (hasActiveFilters) {
      search(filters);
    }
  };

  const clearFilters = () => {
    setFilters({
      language: '',
      categoryId: '',
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

  const displaySnippets = results.length > 0 || hasActiveFilters ? results : snippets;

  return (
    <MainLayout categories={categories} onSearch={handleSearch}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Total Snippets</div>
            <div className="text-2xl font-bold text-gray-100">{stats.totalSnippets}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Categories</div>
            <div className="text-2xl font-bold text-gray-100">{stats.totalCategories}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Tags</div>
            <div className="text-2xl font-bold text-gray-100">{stats.totalTags}</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="text-sm text-gray-400">Favorites</div>
            <div className="text-2xl font-bold text-gray-100">{stats.favorites}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-100">Filters</h2>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
              <select
                value={filters.language}
                onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 px-3 py-2 text-sm"
              >
                <option value="">All Languages</option>
                {LANGUAGES.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <select
                value={filters.categoryId}
                onChange={(e) => setFilters({ ...filters, categoryId: e.target.value })}
                className="w-full rounded-md border border-gray-700 bg-gray-900 text-gray-100 px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={filters.tagIds.includes(tag.id) ? 'opacity-100' : 'opacity-50'}
                >
                  <TagBadge tag={tag} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.isFavorite}
                onChange={(e) => setFilters({ ...filters, isFavorite: e.target.checked })}
                className="rounded border-gray-600 bg-gray-700"
              />
              <span className="text-sm font-medium text-gray-300">Favorites only</span>
            </label>
          </div>
        </div>

        {/* Snippets List */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-100">All Snippets</h1>
          <span className="text-sm text-gray-400">{displaySnippets.length} snippets</span>
        </div>
        <SnippetList snippets={displaySnippets} loading={loading || searchLoading} />
      </div>
    </MainLayout>
  );
}
