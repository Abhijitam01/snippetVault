'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Code2, Heart, Eye, GitFork } from 'lucide-react';

interface PublicSnippet {
  id: string;
  title: string;
  description?: string | null;
  language: string;
  shortCode: string;
  viewCount: number;
  forkedCount: number;
  user: {
    name?: string | null;
    username?: string | null;
    avatar?: string | null;
  };
  _count: {
    likes: number;
  };
  tags: Array<{
    id: string;
    name: string;
    color?: string | null;
  }>;
  category?: {
    name: string;
    icon?: string | null;
  } | null;
}

export default function PublicSnippets() {
  const [snippets, setSnippets] = useState<PublicSnippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/snippets?visibility=public')
      .then((res) => res.json())
      .then((data) => {
        setSnippets(data.slice(0, 6)); // Show only 6 recent snippets
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch public snippets:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-white/60 font-mono">Loading snippets...</div>
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="text-center py-12 rounded-lg border border-white/10 bg-black/40">
        <Code2 className="w-12 h-12 text-white/30 mx-auto mb-4" />
        <p className="text-white/60 font-mono">No public snippets yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {snippets.map((snippet) => (
        <Link
          key={snippet.id}
          href={`/s/${snippet.shortCode}`}
          className="group block rounded-lg border border-white/10 bg-black/40 p-6 hover:border-blue-500/50 hover:bg-black/60 transition-all duration-300"
        >
          <div className="space-y-3">
            {/* Author */}
            <div className="flex items-center gap-2">
              {snippet.user.avatar ? (
                <img
                  src={snippet.user.avatar}
                  alt={snippet.user.name || snippet.user.username || 'User'}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-xs font-mono text-blue-400">
                    {(snippet.user.name || snippet.user.username || 'U')[0].toUpperCase()}
                  </span>
                </div>
              )}
              <span className="text-xs text-white/60 font-mono">
                {snippet.user.name || snippet.user.username}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors font-mono line-clamp-2">
              {snippet.title}
            </h3>

            {/* Description */}
            {snippet.description && (
              <p className="text-sm text-white/60 font-mono line-clamp-2">
                {snippet.description}
              </p>
            )}

            {/* Language & Category */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {snippet.language}
              </span>
              {snippet.category && (
                <span className="px-2 py-1 rounded bg-white/5 text-white/70 border border-white/10">
                  {snippet.category.icon} {snippet.category.name}
                </span>
              )}
            </div>

            {/* Tags */}
            {snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {snippet.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag.id}
                    className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10 font-mono"
                  >
                    {tag.name}
                  </span>
                ))}
                {snippet.tags.length > 3 && (
                  <span className="text-xs px-2 py-0.5 text-white/60 font-mono">
                    +{snippet.tags.length - 3}
                  </span>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 pt-2 text-xs text-white/50 font-mono">
              <div className="flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                <span>{snippet._count.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                <span>{snippet.viewCount}</span>
              </div>
              {snippet.forkedCount > 0 && (
                <div className="flex items-center gap-1">
                  <GitFork className="w-3.5 h-3.5" />
                  <span>{snippet.forkedCount}</span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

