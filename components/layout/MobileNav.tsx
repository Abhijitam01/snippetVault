'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Plus, Settings, Search } from 'lucide-react';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/snippets/new', label: 'New', icon: Plus },
    { href: '/settings/profile', label: 'Settings', icon: Settings },
    { href: '/dashboard', label: 'Search', icon: Search },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl sm:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/dashboard' && pathname?.startsWith('/snippets'));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
                isActive
                  ? 'text-blue-400'
                  : 'text-white/60 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-mono">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

