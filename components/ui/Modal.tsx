// components/ui/Modal.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className={cn(
        'relative z-50 w-full max-w-lg max-h-[90vh] overflow-y-auto',
        'bg-white rounded-lg shadow-xl p-6',
        'dark:bg-gray-800',
        className
      )}>
        {title && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

