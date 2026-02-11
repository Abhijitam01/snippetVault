'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import TagBadge from '@/components/ui/TagBadge';
import Button from '@/components/ui/Button';
import { formatDateTime, getLanguageColor } from '@/lib/utils';
import type { Snippet } from '@/types';
import Prism from 'prismjs';
import { Share2, Copy, Check } from 'lucide-react';
import ShareModal from '@/components/ui/ShareModal';

interface SnippetViewerProps {
  snippet: Snippet & {
    user?: {
      id: string;
      name?: string | null;
      username?: string | null;
      avatar?: string | null;
    };
  };
  onEdit?: () => void;
  onDelete?: () => void;
  shareMode?: boolean;
  variant?: 'full' | 'codeOnly';
}

export default function SnippetViewer({
  snippet,
  onEdit,
  onDelete,
  shareMode = false,
  variant = 'full',
}: SnippetViewerProps) {
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  const resources = useMemo(() => {
    if (!snippet.resources) return [];
    try {
      const parsed = JSON.parse(snippet.resources);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [snippet.resources]);

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

  const openShareModal = () => {
    setShowShareModal(true);
  };

  return (
    <div className="space-y-6">
      {variant === 'full' && (
        <>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 font-mono tracking-tighter">
                {snippet.title}
                {snippet.isFavorite && <span className="ml-2 text-yellow-400">★</span>}
              </h1>
              <div className="flex items-center gap-4 text-xs font-bold text-gray-500 dark:text-gray-400 font-mono uppercase tracking-widest">
                <span
                  className="px-2 py-1 rounded bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800"
                >
                  {snippet.language}
                </span>
                <span className="flex items-center gap-1 opacity-70">
                  Updated {formatDateTime(snippet.updatedAt)}
                </span>
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
            <p className="text-lg text-gray-600 dark:text-gray-300 font-mono leading-relaxed border-l-4 border-violet-500/20 pl-4 py-1">{snippet.description}</p>
          )}

          {snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {snippet.tags.map((tag) => (
                <TagBadge key={tag.id} tag={tag} />
              ))}
            </div>
          )}
        </>
      )}

      <div className="bg-zinc-950 dark:bg-black rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden relative shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border-b border-gray-200 dark:border-white/10">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400 font-mono uppercase tracking-widest">{snippet.language}</span>
          <div className="flex items-center gap-2">
            {shareMode && (
              <button
                onClick={openShareModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-tight bg-white dark:bg-white/5 text-gray-600 dark:text-white/70 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
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

      {variant === 'full' && (
        <>
          {snippet.notes && (
            <div className="bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-violet-500/10 transition-colors duration-500"></div>
              <h3 className="text-sm font-bold text-violet-900 dark:text-violet-400 mb-2 font-mono uppercase tracking-widest">Notes</h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono relative z-10">{snippet.notes}</p>
            </div>
          )}

          {resources.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white font-mono uppercase tracking-widest">Related Resources</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {resources.map((url: string, index: number) => (
                  <li key={index}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 transition-all group"
                    >
                      <Share2 className="w-4 h-4 text-gray-400 group-hover:text-violet-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white font-mono truncate">
                        {url.replace(/^https?:\/\//, '')}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {/* Share Modal */}
      {shareMode && (snippet as any).shortCode && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shortCode={(snippet as any).shortCode}
          title={snippet.title}
          username={snippet.user?.username || undefined}
        />
      )}
    </div>
  );
}

