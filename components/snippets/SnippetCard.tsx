'use client';

import Link from 'next/link';
import { cn, formatDate, truncate, getLanguageColor } from '@/lib/utils';
import TagBadge from '@/components/ui/TagBadge';
import { Star, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Snippet } from '@/types';

interface SnippetCardProps {
  snippet: Snippet;
}

export default function SnippetCard({ snippet }: SnippetCardProps) {
  const languageColor = getLanguageColor(snippet.language);

  const handleShare = (e: React.MouseEvent) => {
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
  };

  return (
    <div className="group relative block overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/20"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <Link href={`/snippets/${snippet.id}`} className="absolute inset-0 z-0" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-white group-hover:text-gray-50 transition-colors pr-2 font-mono">
            {truncate(snippet.title, 40)}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all opacity-0 group-hover:opacity-100 relative z-20"
              title="Share snippet"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {snippet.isFavorite && (
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            )}
            <span
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border backdrop-blur-sm transition-all font-mono"
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

        {snippet.description && (
          <p className="text-sm text-white/60 mb-4 line-clamp-2 group-hover:text-white/80 transition-colors font-mono">
            {truncate(snippet.description, 100)}
          </p>
        )}

        {snippet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {snippet.tags.slice(0, 3).map((tag) => (
              <TagBadge key={tag.id} tag={tag} />
            ))}
            {snippet.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-500 bg-gray-800/50 rounded-md border border-gray-700">
                +{snippet.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center text-xs text-white/50 pt-3 border-t border-white/10 font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatDate(snippet.updatedAt)}</span>
          </div>
        </div>
      </div>
      
      <div 
        className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at top right, ${languageColor}20, transparent 70%)`
        }}
      />
    </div>
  );
}

