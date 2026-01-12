// components/snippets/SnippetViewer.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import TagBadge from '@/components/ui/TagBadge';
import Button from '@/components/ui/Button';
import { formatDateTime, getLanguageColor } from '@/lib/utils';
import type { Snippet } from '@/types';
import Prism from 'prismjs';

interface SnippetViewerProps {
  snippet: Snippet;
  onEdit?: () => void;
  onDelete?: () => void;
}

export default function SnippetViewer({ snippet, onEdit, onDelete }: SnippetViewerProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Dynamically import language components
    const loadLanguage = async (lang: string) => {
      const prismLang = lang.toLowerCase();
      try {
        switch (prismLang) {
          case 'typescript':
            await import('prismjs/components/prism-typescript');
            break;
          case 'javascript':
            await import('prismjs/components/prism-javascript');
            break;
          case 'python':
            await import('prismjs/components/prism-python');
            break;
          case 'java':
            await import('prismjs/components/prism-java');
            break;
          case 'cpp':
          case 'c++':
            await import('prismjs/components/prism-cpp');
            break;
          case 'c':
            await import('prismjs/components/prism-c');
            break;
          case 'go':
            await import('prismjs/components/prism-go');
            break;
          case 'rust':
            await import('prismjs/components/prism-rust');
            break;
          case 'sql':
            await import('prismjs/components/prism-sql');
            break;
          case 'bash':
          case 'shell':
            await import('prismjs/components/prism-bash');
            break;
          case 'yaml':
            await import('prismjs/components/prism-yaml');
            break;
          case 'json':
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

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {snippet.title}
            {snippet.isFavorite && <span className="ml-2">⭐</span>}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span
              className="px-2 py-1 text-xs font-medium rounded"
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
        <p className="text-gray-700 dark:text-gray-300">{snippet.description}</p>
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
          <span className="text-sm text-gray-400">{snippet.language}</span>
          <Button size="sm" variant="ghost" onClick={copyCode}>
            {copied ? 'Copied!' : 'Copy'}
          </Button>
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
    </div>
  );
}

