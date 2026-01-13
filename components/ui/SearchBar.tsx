'use client';

import { useState, FormEvent, useEffect, useRef, forwardRef } from 'react';
import Input from './Input';
import Button from './Button';
import { Search, X, Bookmark, HelpCircle } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showHelp?: boolean;
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ onSearch, placeholder = 'Search snippets...', className, showHelp = true }, ref) => {
    const [query, setQuery] = useState('');
    const [showSearchHelp, setShowSearchHelp] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new timeout for debounced search - increased delay to reduce flickering
    debounceRef.current = setTimeout(() => {
      onSearch(query);
    }, 500);

    // Cleanup
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-white/40 pointer-events-none" />
          <Input
            ref={ref}
            type="search"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSearchHelp(true)}
            className="flex-1 pl-10 pr-20 font-mono text-sm"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {showHelp && (
              <button
                type="button"
                onClick={() => setShowSearchHelp(!showSearchHelp)}
                className="p-1.5 text-white/40 hover:text-white transition-colors"
                title="Search help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-white/40 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </form>
      {showSearchHelp && showHelp && (
        <div className="absolute top-full left-0 right-0 mt-2 p-4 rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl z-50 shadow-xl">
          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-white/80 font-semibold">Search operators:</span>
              <ul className="mt-1 space-y-1 text-white/60">
                <li><code className="text-blue-400">AND</code> - All terms must match</li>
                <li><code className="text-blue-400">OR</code> - Any term can match (default)</li>
                <li><code className="text-blue-400">-term</code> or <code className="text-blue-400">NOT term</code> - Exclude term</li>
                <li><code className="text-blue-400">&quot;exact phrase&quot;</code> - Search exact phrase</li>
              </ul>
            </div>
            <div className="pt-2 border-t border-white/10">
              <span className="text-white/80 font-semibold">Examples:</span>
              <ul className="mt-1 space-y-1 text-white/60">
                <li><code className="text-blue-400">react AND hooks</code></li>
                <li><code className="text-blue-400">typescript -javascript</code></li>
                <li><code className="text-blue-400">&quot;useState hook&quot;</code></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;

