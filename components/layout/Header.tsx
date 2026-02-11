'use client';

import { useRef } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Logo from '@/components/ui/Logo';
import { useAuth } from '@/lib/hooks/useAuth';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface HeaderProps {
  onSearch: (query: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement>;
}

export default function Header({ onSearch, searchInputRef }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { logout, user } = useAuth();

  const handleExport = async () => {
    try {
      const response = await fetch('/api/export');
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `snippets-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Snippets exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export snippets');
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      const snippets = Array.isArray(data) ? data : data.snippets || [];
      
      if (!Array.isArray(snippets)) {
        throw new Error('Invalid file format');
      }

      const response = await fetch('/api/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ snippets }),
      });

      if (!response.ok) throw new Error('Import failed');
      
      const result = await response.json();
      toast.success(`Imported ${result.imported} snippet(s) successfully!`);
      
      // Use router instead of window.location.reload() for better performance
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import snippets. Please check the file format.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-md transition-colors duration-300">
      <div className="flex h-14 items-center justify-between gap-2 px-4 sm:px-6 mx-auto w-full max-w-6xl">
        <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
          <Link href="/dashboard" className="flex sm:flex items-center gap-2 text-sm font-mono text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0">
            <Logo size={18} className="text-gray-900 dark:text-white" />
            <span className="hidden md:inline">SnippetVault</span>
          </Link>
          <div className="flex-1 max-w-xl">
            <SearchBar ref={searchInputRef} onSearch={onSearch} showHelp={false} />
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
          {user && (
            <Link 
              href="/settings/profile"
              className="hidden lg:block text-xs font-mono text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white/80 transition-colors cursor-pointer"
            >
              {user.email}
            </Link>
          )}
          <div className="flex items-center gap-3">
             <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleExport} className="hidden md:flex">
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport} className="hidden md:flex">
              Import
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </header>
  );
}

