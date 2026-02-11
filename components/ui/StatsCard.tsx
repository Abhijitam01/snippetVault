'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: string;
  className?: string;
}

/**
 * Minimal stats card used across dashboard and landing.
 * Keeps a single, neutral style so the app feels cohesive
 * and "built by one developer" instead of many.
 */
export default function StatsCard({
  title,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <section
      className={cn(
        'rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-black/40 px-4 py-3 flex flex-col gap-1',
        'shadow-sm hover:border-violet-500/40 hover:bg-gray-50 dark:hover:bg-black/60 transition-colors',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-mono uppercase tracking-wide text-gray-500 dark:text-white/50">
          {title}
        </p>
        {icon && <div className="text-violet-500 dark:text-white/40">{icon}</div>}
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white font-mono">{value}</p>
        {trend && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">{trend}</span>
        )}
      </div>
    </section>
  );
}

