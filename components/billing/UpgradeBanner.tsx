'use client';

import { Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface UpgradeBannerProps {
  message: string;
  ctaText?: string;
  dismissible?: boolean;
  variant?: 'warning' | 'info';
}

export default function UpgradeBanner({
  message,
  ctaText = 'Upgrade to Pro',
  dismissible = true,
  variant = 'info',
}: UpgradeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  if (dismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4',
        variant === 'warning'
          ? 'border-yellow-500/30 bg-yellow-500/10'
          : 'border-blue-500/30 bg-blue-500/10'
      )}
    >
      <div className="flex items-start gap-3">
        <Sparkles
          className={cn(
            'w-5 h-5 flex-shrink-0 mt-0.5',
            variant === 'warning' ? 'text-yellow-400' : 'text-blue-400'
          )}
        />
        <div className="flex-1">
          <p className="text-sm text-white/90 font-mono">{message}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="primary"
            onClick={() => router.push('/billing')}
          >
            {ctaText}
          </Button>
          {dismissible && (
            <button
              onClick={() => setDismissed(true)}
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

