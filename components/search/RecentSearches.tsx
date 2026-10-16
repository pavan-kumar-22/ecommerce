'use client';

import React, { useState, useEffect } from 'react';
import { History, X } from 'lucide-react';

interface RecentSearchesProps {
  onSelectSearch: (term: string) => void;
  currentQuery?: string;
}

const STORAGE_KEY = 'vuyyuru_recent_searches';
const MAX_RECENT = 6;

export const RecentSearches: React.FC<RecentSearchesProps> = ({
  onSelectSearch,
  currentQuery,
}) => {
  const [recentTerms, setRecentTerms] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentTerms(parsed);
        }
      }
    } catch {
      // Storage unavailable or blocked
    }
  }, []);

  // Save term if currentQuery is valid and not already first
  useEffect(() => {
    if (!currentQuery || !currentQuery.trim()) return;
    const clean = currentQuery.trim();

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      let list: string[] = stored ? JSON.parse(stored) : [];
      list = [clean, ...list.filter((t) => t.toLowerCase() !== clean.toLowerCase())].slice(
        0,
        MAX_RECENT
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      setRecentTerms(list);
    } catch {
      // Ignore storage errors
    }
  }, [currentQuery]);

  const handleRemove = (termToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const updated = recentTerms.filter((t) => t !== termToRemove);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setRecentTerms(updated);
    } catch {
      // Ignore
    }
  };

  const handleClearAll = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setRecentTerms([]);
    } catch {
      // Ignore
    }
  };

  if (recentTerms.length === 0) return null;

  return (
    <div className="py-3" aria-label="Recent searches">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#6B3F23]">
          <History className="w-3.5 h-3.5" />
          <span>Recent Searches</span>
        </div>
        <button
          onClick={handleClearAll}
          className="text-[11px] text-[#8C7E72] hover:text-[#201A15] transition-colors focus-accessible"
        >
          Clear all
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {recentTerms.map((term) => (
          <div
            key={term}
            onClick={() => onSelectSearch(term)}
            className="group inline-flex items-center gap-1.5 bg-white border border-[#E5DDD1] hover:border-[#6B3F23]/40 text-[#201A15] px-3 py-1.5 rounded-full text-xs cursor-pointer transition-colors shadow-2xs"
          >
            <span>{term}</span>
            <button
              onClick={(e) => handleRemove(term, e)}
              className="text-[#8C7E72] hover:text-red-600 rounded-full p-0.5"
              aria-label={`Remove ${term} from recent searches`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
