'use client';

import SnippetBentoGrid from './SnippetBentoGrid';
import type { Snippet } from '@/types';

interface SnippetListProps {
  snippets: Snippet[];
  loading?: boolean;
}

export default function SnippetList({ snippets, loading }: SnippetListProps) {
  return <SnippetBentoGrid snippets={snippets} loading={loading} />;
}

