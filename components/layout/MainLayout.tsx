// components/layout/MainLayout.tsx
'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import type { Category } from '@/types';

interface MainLayoutProps {
  children: ReactNode;
  categories: Category[];
  onSearch: (query: string) => void;
}

export default function MainLayout({ children, categories, onSearch }: MainLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar categories={categories} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onSearch={onSearch} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

