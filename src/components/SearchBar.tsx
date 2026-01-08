'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SearchBar({ onSearch, placeholder = 'Search tracks...' }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-4 sm:left-4 text-gray-400" size={20} />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 sm:pl-12 pr-12 sm:pr-12 py-3 sm:py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all text-base sm:text-base touch-manipulation min-h-[44px] sm:min-h-0"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 sm:right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
            aria-label="Clear search"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

