// components/ui/TagBadge.tsx
import { cn } from '@/lib/utils';
import type { Tag } from '@/types';

interface TagBadgeProps {
  tag: Tag;
  onClick?: () => void;
  className?: string;
}

export default function TagBadge({ tag, onClick, className }: TagBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        onClick && 'cursor-pointer hover:opacity-80',
        className
      )}
      style={{ backgroundColor: tag.color ? `${tag.color}20` : '#E5E7EB', color: tag.color || '#374151' }}
      onClick={onClick}
    >
      {tag.name}
    </span>
  );
}

