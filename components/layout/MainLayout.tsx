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
      <div className="flex h-screen bg-white dark:bg-black transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Vertical Lines Background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_100%]"></div>
            </div>

          <Header onSearch={onSearch} searchInputRef={searchInputRef} />
          <main className="flex-1 overflow-y-auto bg-transparent pb-16 sm:pb-0 relative z-10">
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

