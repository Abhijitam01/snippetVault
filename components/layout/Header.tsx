'use client';

import { useRef } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { LogOut } from 'lucide-react';
import toast from 'react-hot-toast';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
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
      
      window.location.reload();
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between gap-4 px-6 mx-auto w-full max-w-6xl">
        <div className="flex items-center gap-4 flex-1">
          <span className="hidden sm:inline text-sm font-mono text-white/70">
            SnippetVault
          </span>
          <div className="flex-1 max-w-xl">
            <SearchBar onSearch={onSearch} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:block text-xs font-mono text-white/50 font-mono">
              {user.email}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport}>
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

