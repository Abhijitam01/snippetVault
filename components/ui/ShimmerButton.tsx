'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'outline';
}

export default function ShimmerButton({
  children,
  className,
  variant = 'primary',
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-lg px-6 py-2.5 font-medium transition-all',
        'before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:transition-transform before:duration-1000 hover:before:translate-x-[100%]',
        variant === 'primary'
          ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500'
          : 'bg-transparent text-white border border-white/20 hover:border-blue-400 hover:text-blue-400',
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}

