'use client';

import { useState, useEffect, useRef } from 'react';
import TagBadge from '@/components/ui/TagBadge';
import Button from '@/components/ui/Button';
import { formatDateTime, getLanguageColor } from '@/lib/utils';
import type { Snippet } from '@/types';
import Prism from 'prismjs';
import { Heart, GitFork, Share2, Copy, Check } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import ShareModal from '@/components/ui/ShareModal';

interface SnippetViewerProps {
  snippet: Snippet & {
    user?: {
      id: string;
      name?: string | null;
      username?: string | null;
      avatar?: string | null;
    };
    _count?: {
      likes: number;
    };
    hasLiked?: boolean;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  shareMode?: boolean;
}

export default function SnippetViewer({ snippet, onEdit, onDelete, shareMode = false }: SnippetViewerProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [liked, setLiked] = useState(snippet.hasLiked || false);
  const [likeCount, setLikeCount] = useState(snippet._count?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const codeRef = useRef<HTMLElement>(null);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Dynamically import language components
    const loadLanguage = async (lang: string) => {
      const prismLang = lang.toLowerCase();
      try {
        switch (prismLang) {
          case 'typescript':
            // @ts-ignore
            await import('prismjs/components/prism-typescript');
            break;
          case 'javascript':
            // @ts-ignore
            await import('prismjs/components/prism-javascript');
            break;
          case 'python':
            // @ts-ignore
            await import('prismjs/components/prism-python');
            break;
          case 'java':
            // @ts-ignore
            await import('prismjs/components/prism-java');
            break;
          case 'cpp':
          case 'c++':
            // @ts-ignore
            await import('prismjs/components/prism-cpp');
            break;
          case 'c':
            // @ts-ignore
            await import('prismjs/components/prism-c');
            break;
          case 'go':
            // @ts-ignore
            await import('prismjs/components/prism-go');
            break;
          case 'rust':
            // @ts-ignore
            await import('prismjs/components/prism-rust');
            break;
          case 'sql':
            // @ts-ignore
            await import('prismjs/components/prism-sql');
            break;
          case 'bash':
          case 'shell':
            // @ts-ignore
            await import('prismjs/components/prism-bash');
            break;
          case 'yaml':
            // @ts-ignore
            await import('prismjs/components/prism-yaml');
            break;
          case 'json':
            // @ts-ignore
            await import('prismjs/components/prism-json');
            break;
          default:
            break;
        }
      } catch (error) {
        console.warn(`Failed to load Prism language: ${prismLang}`, error);
      }
      
      if (codeRef.current) {
        Prism.highlightElement(codeRef.current);
      }
    };

    loadLanguage(snippet.language);
  }, [snippet.language, snippet.code]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/s/${(snippet as any).shortCode}`;
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const openShareModal = () => {
    setShowShareModal(true);
  };

  const handleLike = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (isLiking) return;

    setIsLiking(true);
    const newLiked = !liked;
    const newCount = newLiked ? likeCount + 1 : likeCount - 1;
    
    // Optimistic update
    setLiked(newLiked);
    setLikeCount(newCount);

    try {
      const response = await fetch(`/api/snippets/${snippet.id}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        // Revert on error
        setLiked(!newLiked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error('Failed to like snippet:', error);
      // Revert on error
      setLiked(!newLiked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } finally {
      setIsLiking(false);
    }
  };

  const handleFork = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      const response = await fetch(`/api/snippets/${snippet.id}/fork`, {
        method: 'POST',
      });

      if (response.ok) {
        const forkedSnippet = await response.json();
        router.push(`/snippets/${forkedSnippet.id}`);
      }
    } catch (error) {
      console.error('Failed to fork snippet:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-mono">
            {snippet.title}
            {snippet.isFavorite && <span className="ml-2">⭐</span>}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
            <span
              className="px-2 py-1 text-xs font-medium rounded font-mono"
              style={{
                backgroundColor: `${getLanguageColor(snippet.language)}20`,
                color: getLanguageColor(snippet.language),
              }}
            >
              {snippet.language}
            </span>
            <span>Updated {formatDateTime(snippet.updatedAt)}</span>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && <Button onClick={onEdit}>Edit</Button>}
          {onDelete && (
            <Button variant="danger" onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      </div>

      {snippet.description && (
        <p className="text-gray-700 dark:text-gray-300 font-mono">{snippet.description}</p>
      )}

      {snippet.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {snippet.tags.map((tag) => (
            <TagBadge key={tag.id} tag={tag} />
          ))}
        </div>
      )}

      <div className="bg-gray-900 rounded-lg p-4 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400 font-mono">{snippet.language}</span>
          <div className="flex items-center gap-2">
            {shareMode && (
              <>
                <button
                  onClick={handleLike}
                  disabled={isLiking}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono transition-colors ${
                    liked
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                </button>
                <button
                  onClick={handleFork}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <GitFork className="w-4 h-4" />
                  <span>Fork</span>
                </button>
                <button
                  onClick={openShareModal}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </>
            )}
            <Button size="sm" variant="ghost" onClick={copyCode}>
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-1" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </div>
        <pre className="overflow-x-auto">
          <code ref={codeRef} className={`language-${snippet.language.toLowerCase()} text-sm`}>
            {snippet.code}
          </code>
        </pre>
      </div>

      {snippet.notes && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Notes</h3>
          <p className="text-blue-800 dark:text-blue-200 whitespace-pre-wrap">{snippet.notes}</p>
        </div>
      )}

      {snippet.resources && JSON.parse(snippet.resources).length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Resources</h3>
          <ul className="list-disc list-inside space-y-1">
            {JSON.parse(snippet.resources).map((url: string, index: number) => (
              <li key={index}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share Modal */}
      {shareMode && (snippet as any).shortCode && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shortCode={(snippet as any).shortCode}
          title={snippet.title}
        />
      )}
    </div>
  );
}

