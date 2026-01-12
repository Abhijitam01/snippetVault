// components/snippets/SnippetCard.tsx
'use client';

import Link from 'next/link';
import { cn, formatDate, truncate, getLanguageColor } from '@/lib/utils';
import TagBadge from '@/components/ui/TagBadge';
import type { Snippet } from '@/types';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  return (
    <Link
      href={`/snippets/${snippet.id}`}
      className="block p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {snippet.title}
          {snippet.isFavorite && <span className="ml-2">⭐</span>}
        </h3>
        <span
          className="px-2 py-1 text-xs font-medium rounded"
          style={{
            backgroundColor: `${getLanguageColor(snippet.language)}20`,
            color: getLanguageColor(snippet.language),
          }}
        >
          {snippet.language}
        </span>
      </div>

      {snippet.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {truncate(snippet.description, 100)}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {snippet.tags.slice(0, 3).map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
        {snippet.tags.length > 3 && (
          <span className="text-xs text-gray-500">+{snippet.tags.length - 3} more</span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{formatDate(snippet.updatedAt)}</span>
        {snippet.category && (
          <span className="flex items-center gap-1">
            {snippet.category.icon && <span>{snippet.category.icon}</span>}
            {snippet.category.name}
          </span>
        )}
      </div>
    </Link>
  );
}

