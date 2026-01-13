'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from '@/components/ui/Logo';
import { memo } from 'react';

const Sidebar = memo(function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'All snippets' },
    { href: '/snippets/new', label: 'New snippet' },
    { href: '/settings/profile', label: 'Settings' },
  ];

  return (
    <aside className="hidden sm:block w-60 bg-black border-r border-white/10 h-screen overflow-y-auto">
      <div className="flex flex-col h-full px-4 py-4 gap-6">
        <Link href="/dashboard" className="space-y-1 block">
          <div className="flex items-center gap-2">
            <Logo size={20} />
            <h1 className="text-lg font-semibold text-white tracking-tight font-mono">SnippetVault</h1>
          </div>
          <p className="text-xs text-white/70 font-mono">Personal snippet vault</p>
        </Link>

        <nav className="space-y-1 text-sm">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-3 py-2 transition-colors font-mono',
                      isActive
                        ? 'bg-white/10 text-white border-l-2 border-l-blue-500'
                        : 'text-white hover:text-white hover:bg-white/5'
                    )}
                  >
                    <span className="text-xs font-mono text-white/70">//</span>
                    <span className="font-mono text-white">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-white/5 text-[10px] text-white/70">
          <p className="font-mono">
            built by{' '}
            <a
              href="https://github.com/Abhijitam01"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-blue-400 transition-colors"
            >
              Abhijitam Dubey
            </a>
            {' '}· v0.1
          </p>
        </div>
      </div>
    </aside>
  );
});

export default Sidebar;

