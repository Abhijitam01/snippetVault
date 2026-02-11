import { cn } from '@/lib/utils';
import type { Tag } from '@/types';

interface TagBadgeProps {
  tag: Tag;
  onClick?: () => void;
  className?: string;
}

export default function TagBadge({ tag, onClick, className }: TagBadgeProps) {
  const tagColor = tag.color || '#6366f1';
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium font-mono border backdrop-blur-sm transition-all bg-white dark:bg-zinc-900/80',
        onClick && 'hover:scale-105 cursor-pointer',
        className
      )}
      style={{
        borderColor: `${tagColor}20`,
        color: tagColor,
      }}
      onClick={onClick}
    >
      {tag.name}
    </span>
  );
}

