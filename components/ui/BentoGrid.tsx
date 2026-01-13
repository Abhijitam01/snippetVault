'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  title?: string;
  description?: string;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  span?: '1' | '2' | '3' | '4';
  children?: ReactNode;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  title,
  description,
  header,
  footer,
  className,
  span = '1',
  children,
}: BentoCardProps) {
  const spanClasses = {
    '1': 'md:col-span-1',
    '2': 'md:col-span-2',
    '3': 'md:col-span-3',
    '4': 'md:col-span-4',
  };

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/20',
        spanClasses[span],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col h-full">
        {header && <div className="mb-4">{header}</div>}
        
        {(title || description) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-white/60">{description}</p>
            )}
          </div>
        )}
        
        {children && <div className="flex-1">{children}</div>}
        
        {footer && <div className="mt-4">{footer}</div>}
      </div>
      
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

