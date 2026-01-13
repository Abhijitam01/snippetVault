'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientBorderProps {
  children: ReactNode;
  className?: string;
  borderWidth?: number;
}

export default function AnimatedGradientBorder({
  children,
  className,
  borderWidth = 2,
}: AnimatedGradientBorderProps) {
  return (
    <div
      className={cn('relative p-[2px] rounded-xl animate-gradient-shift', className)}
      style={{
        background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #3b82f6)',
        backgroundSize: '200% 200%',
      }}
    >
      <div className="bg-black rounded-xl h-full w-full">{children}</div>
    </div>
  );
}

