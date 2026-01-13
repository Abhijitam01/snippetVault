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
    <div className="flex h-screen bg-black">
      <Sidebar categories={categories} />
      <div className="flex-1 flex flex-col overflow-hidden bg-black">
        <Header onSearch={onSearch} />
        <main className="flex-1 overflow-y-auto bg-black">
          <div className="mx-auto w-full max-w-6xl px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

