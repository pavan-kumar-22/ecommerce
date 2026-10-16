import React from 'react';
import Link from 'next/link';
import { SearchX, ArrowRight, Sparkles } from 'lucide-react';

interface NoResultsPanelProps {
  query: string;
  suggestions?: string[];
  onSelectSuggestion?: (term: string) => void;
  onClearSearch?: () => void;
}

export const NoResultsPanel: React.FC<NoResultsPanelProps> = ({
  query,
  suggestions = [],
  onSelectSuggestion,
  onClearSearch,
}) => {
  return (
    <div
      className="p-8 sm:p-12 bg-white rounded-2xl border border-[#E5DDD1] text-center max-w-2xl mx-auto shadow-xs"
      role="region"
      aria-label="No search results"
    >
      <div className="w-14 h-14 rounded-full bg-[#FAF3EB] text-[#6B3F23] flex items-center justify-center mx-auto mb-4">
        <SearchX className="w-7 h-7" aria-hidden="true" />
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-[#201A15] mb-2">
        No matches found for &ldquo;<span className="text-[#6B3F23]">{query}</span>&rdquo;
      </h2>

      <p className="text-xs sm:text-sm text-[#5C4D41] max-w-md mx-auto leading-relaxed mb-6">
        We couldn&apos;t find an exact product or service matching your search. Check for spelling,
        try broader terms like &ldquo;teak&rdquo; or &ldquo;table&rdquo;, or request a custom quotation.
      </p>

      {/* Suggested Search Terms */}
      {suggestions.length > 0 && (
        <div className="mb-8 pt-4 border-t border-[#F0EAE1]">
          <span className="text-xs font-semibold text-[#6B3F23] block mb-3">
            Popular Workshop Searches:
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSelectSuggestion?.(suggestion)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF7F2] border border-[#E5DDD1] text-[#201A15] hover:bg-[#EFE8DC] transition-colors focus-accessible shadow-2xs"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Action Links */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-[#F0EAE1]">
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E5DDD1] text-[#201A15] hover:bg-[#EFE8DC] transition-colors focus-accessible"
        >
          Browse full catalogue
        </Link>

        <Link
          href="/custom-furniture"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#1E4D2B] text-white hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Request made-to-measure design</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
