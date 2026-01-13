import { cn } from '@/lib/utils';
import type { Tag } from '@/types';

interface TagBadgeProps {
  tag: Tag;
  onClick?: () => void;
  className?: string;
}

export default function TagBadge({ tag, onClick, className }: TagBadgeProps) {
  const tagColor = tag.color || '#3b82f6';
  
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium border backdrop-blur-sm transition-all',
        onClick && 'hover:scale-105',
        className
      )}
      style={{
        backgroundColor: tagColor === '#3b82f6' ? 'rgba(59, 130, 246, 0.1)' : `${tagColor}15`,
        borderColor: tagColor === '#3b82f6' ? 'rgba(59, 130, 246, 0.3)' : `${tagColor}40`,
        color: tagColor === '#3b82f6' ? '#60a5fa' : tagColor,
      }}
      onClick={onClick}
    >
      {tag.name}
    </span>
  );
}

