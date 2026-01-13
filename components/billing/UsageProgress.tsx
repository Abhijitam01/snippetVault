'use client';

import { cn } from '@/lib/utils';

interface UsageProgressProps {
  label: string;
  current: number;
  limit: number | string;
  percentage: number;
  className?: string;
}

export default function UsageProgress({
  label,
  current,
  limit,
  percentage,
  className,
}: UsageProgressProps) {
  const isUnlimited = limit === Infinity || limit === '∞' || limit === -1;
  const isNearLimit = percentage >= 80 && !isUnlimited;
  const isAtLimit = percentage >= 100 && !isUnlimited;

  const displayLimit = isUnlimited ? '∞' : limit;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white/80 font-mono">
          {label}
        </span>
        <span className="text-sm text-white/60 font-mono">
          {current.toLocaleString()} / {displayLimit.toLocaleString()}
        </span>
      </div>

      {!isUnlimited && (
        <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              isAtLimit
                ? 'bg-red-500'
                : isNearLimit
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}

      {isUnlimited && (
        <div className="text-xs text-blue-400 font-mono">Unlimited</div>
      )}

      {isAtLimit && (
        <p className="text-xs text-red-400 font-mono">
          Limit reached. Upgrade for more.
        </p>
      )}

      {isNearLimit && !isAtLimit && (
        <p className="text-xs text-yellow-400 font-mono">
          Approaching limit. Consider upgrading.
        </p>
      )}
    </div>
  );
}

