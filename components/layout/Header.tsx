// components/layout/Header.tsx
'use client';

import { useRef } from 'react';
import SearchBar from '@/components/ui/SearchBar';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      
      // Handle both formats: { snippets: [] } or just []
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
      
      // Refresh the page to show imported snippets
      window.location.reload();
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import snippets. Please check the file format.');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-700 bg-gray-900">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex-1">
          <SearchBar onSearch={onSearch} />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleImport}>
            Import
          </Button>
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

