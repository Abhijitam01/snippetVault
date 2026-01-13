'use client';

import { cn } from '@/lib/utils';

interface GridPatternProps {
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export default function GridPattern({
  className,
  size = 40,
  strokeWidth = 1,
}: GridPatternProps) {
  return (
    <div
      className={cn('absolute inset-0 opacity-20', className)}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(59, 130, 246, 0.1) ${strokeWidth}px, transparent ${strokeWidth}px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.1) ${strokeWidth}px, transparent ${strokeWidth}px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}

