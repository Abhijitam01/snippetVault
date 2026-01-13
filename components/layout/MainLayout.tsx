'use client';

import { ReactNode, useRef, memo } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface MainLayoutProps {
  children: ReactNode;
  onSearch: (query: string) => void;
}

const MainLayout = memo(function MainLayout({ children, onSearch }: MainLayoutProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <div className="flex h-screen bg-black">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden bg-black">
          <Header onSearch={onSearch} searchInputRef={searchInputRef} />
          <main className="flex-1 overflow-y-auto bg-black pb-16 sm:pb-0">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-4 sm:py-6">
              {children}
            </div>
          </main>
        </div>
      </div>
      <MobileNav />
    </>
  );
});

export default MainLayout;

