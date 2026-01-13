'use client';

import SnippetBentoGrid from './SnippetBentoGrid';
import type { Snippet } from '@/types';

interface SnippetListProps {
  snippets: Snippet[];
  loading?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (id: string, selected: boolean) => void;
  selectionMode?: boolean;
}

export default function SnippetList({
  snippets,
  loading,
  selectedIds = [],
  onSelectionChange,
  selectionMode = false,
}: SnippetListProps) {
  return (
    <SnippetBentoGrid
      snippets={snippets}
      loading={loading}
      selectedIds={selectedIds}
      onSelectionChange={onSelectionChange}
      selectionMode={selectionMode}
    />
  );
}

