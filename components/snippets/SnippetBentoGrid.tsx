'use client';

import { useEffect, useRef, memo } from 'react';
import Link from 'next/link';
import { cn, formatDate, truncate, getLanguageColor } from '@/lib/utils';
import TagBadge from '@/components/ui/TagBadge';
import { Star, Clock, Folder, Code2, FileCode, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Snippet } from '@/types';

interface SnippetBentoGridProps {
  snippets: Snippet[];
  loading?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (id: string, selected: boolean) => void;
  selectionMode?: boolean;
}

const SnippetBentoGrid = memo(function SnippetBentoGrid({
  snippets,
  loading,
  selectedIds = [],
  onSelectionChange,
  selectionMode = false,
}: SnippetBentoGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const snippetsRef = useRef<string>('');

  // Track snippet IDs to prevent unnecessary re-renders
  useEffect(() => {
    const currentSnippetIds = snippets.map(s => s.id).join(',');
    snippetsRef.current = currentSnippetIds;
  }, [snippets]);

  // Calculate grid columns based on snippet count
  const getGridCols = (count: number) => {
    if (count === 0) return 'grid-cols-1';
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 6) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  // Determine card size based on index and total count
  const getCardSize = (index: number, total: number) => {
    // Make first card larger if there are enough cards
    if (index === 0 && total >= 3) {
      return 'md:col-span-2 md:row-span-2';
    }
    // Make every 5th card span 2 columns for visual interest
    if (index % 5 === 0 && index > 0 && total > 5) {
      return 'md:col-span-2';
    }
    return 'md:col-span-1';
  };

  if (loading) {
    return (
      <div className={cn('grid gap-4', getGridCols(8))}>
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-black/60 rounded-xl border border-white/10 animate-pulse"
            style={{
              animationDelay: `${i * 50}ms`,
            }}
          />
        ))}
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-16">
        <FileCode className="w-16 h-16 mx-auto text-white/20 mb-4" />
        <p className="text-white/50 font-mono text-sm">No snippets found.</p>
        <p className="text-white/30 font-mono text-xs mt-2">Create your first snippet to get started</p>
      </div>
    );
  }

  // Show all snippets immediately to prevent flickering
  const visibleSnippets = snippets;

  return (
    <div
      ref={containerRef}
      key={snippetsRef.current || 'empty'}
      className={cn('grid gap-4 auto-rows-fr', getGridCols(snippets.length))}
    >
      {visibleSnippets.map((snippet, index) => {
        const languageColor = getLanguageColor(snippet.language);
        const cardSize = getCardSize(index, snippets.length);
        const isLarge = cardSize.includes('row-span-2');

        const isSelected = selectedIds.includes(snippet.id);

        return (
          <div
            key={snippet.id}
            className={cn(
              'group relative overflow-hidden rounded-xl border',
              'bg-white dark:bg-black/60 backdrop-blur-sm',
              'transition-[transform,border-color,box-shadow] duration-200 ease-out',
              selectionMode
                ? 'cursor-pointer'
                : 'hover:scale-[1.01] hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/10',
              isSelected ? 'border-violet-500 ring-2 ring-violet-500/50' : 'border-gray-200 dark:border-white/10',
              cardSize
            )}
            onClick={() => {
              if (selectionMode && onSelectionChange) {
                onSelectionChange(snippet.id, !isSelected);
              }
            }}
          >
            {selectionMode && (
              <div className="absolute top-3 left-3 z-20">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    e.stopPropagation();
                    if (onSelectionChange) {
                      onSelectionChange(snippet.id, e.target.checked);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="h-5 w-5 rounded border-gray-300 dark:border-white/20 bg-white dark:bg-black/60 text-violet-500 focus:ring-violet-500/60 cursor-pointer"
                />
              </div>
            )}
            <Link
              href={`/snippets/${snippet.id}`}
              className="block"
              onClick={(e) => {
                if (selectionMode) {
                  e.preventDefault();
                }
              }}
            >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Language color accent */}
            <div 
              className="absolute top-0 left-0 w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: languageColor }}
            />

            <div className="relative z-10 p-5 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className={cn(
                    'font-semibold text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors font-mono truncate',
                    isLarge ? 'text-xl' : 'text-lg'
                  )}>
                    {snippet.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const shareUrl = snippet.shortCode 
                        ? `${window.location.origin}/s/${snippet.shortCode}`
                        : `${window.location.origin}/snippets/${snippet.id}`;
                      const username = (snippet as any)?.user?.username;
                      const shareUrlWithUsername = username
                        ? `${shareUrl}?username=${encodeURIComponent(username)}`
                        : shareUrl;
                      navigator.clipboard.writeText(shareUrlWithUsername);
                      toast.success('Link copied to clipboard!', {
                        duration: 2000,
                        style: {
                          background: '#000',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        },
                      });
                    }}
                    className="p-1.5 rounded-md bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-all opacity-0 group-hover:opacity-100 relative z-20"
                    title="Share snippet"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  {snippet.isFavorite && (
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" />
                  )}
                  <span
                    className="px-2.5 py-1 text-xs font-semibold rounded-lg border backdrop-blur-sm transition-all font-mono whitespace-nowrap"
                    style={{
                      backgroundColor: `${languageColor}15`,
                      borderColor: `${languageColor}40`,
                      color: languageColor,
                    }}
                  >
                    {snippet.language}
                  </span>
                </div>
              </div>

              {/* Description */}
              {snippet.description && (
                <p className={cn(
                  'text-gray-600 dark:text-white/60 mb-4 group-hover:text-gray-900 dark:group-hover:text-white/80 transition-colors font-mono',
                  isLarge ? 'text-sm line-clamp-4' : 'text-sm line-clamp-2'
                )}>
                  {snippet.description}
                </p>
              )}

              {/* Code preview for larger cards */}
              {isLarge && snippet.code && (
                <div className="mb-4 rounded-lg bg-gray-50 dark:bg-black/60 p-3 border border-gray-200 dark:border-white/5">
                  <pre className="text-xs font-mono text-gray-500 dark:text-white/40 overflow-hidden">
                    <code className="line-clamp-4">
                      {truncate(snippet.code, 150)}
                    </code>
                  </pre>
                </div>
              )}

              {/* Tags */}
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {snippet.tags.slice(0, isLarge ? 5 : 3).map((tag) => (
                    <TagBadge key={tag.id} tag={tag} />
                  ))}
                  {snippet.tags.length > (isLarge ? 5 : 3) && (
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 dark:text-white/40 bg-gray-100 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10 font-mono">
                      +{snippet.tags.length - (isLarge ? 5 : 3)}
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between text-xs text-gray-400 dark:text-white/50 pt-3 border-t border-gray-100 dark:border-white/10 font-mono">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(snippet.updatedAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Animated gradient on hover */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{
                background: `radial-gradient(circle at top right, ${languageColor}20, transparent 70%)`
              }}
            />

            {/* Shimmer effect on hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none">
              <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 dark:via-white/5 to-transparent" />
            </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
});

export default SnippetBentoGrid;

