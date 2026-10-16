'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProjectsPagination: React.FC<ProjectsPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      role="navigation"
      aria-label="Projects pagination"
      className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-[#E5DDD1]"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#D9CFC4] bg-white text-[#201A15] hover:bg-[#F5EFEB] disabled:opacity-40 disabled:pointer-events-none transition-colors focus-accessible shadow-xs"
        aria-label="Go to previous page"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      <div className="flex items-center gap-1.5">
        {pages.map((p) => {
          const isCurrent = p === currentPage;
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-current={isCurrent ? 'page' : undefined}
              className={`w-9 h-9 rounded-xl text-xs sm:text-sm font-semibold transition-all focus-accessible flex items-center justify-center ${
                isCurrent
                  ? 'bg-[#1E4D2B] text-white shadow-xs'
                  : 'bg-white border border-[#D9CFC4] text-[#201A15] hover:bg-[#F5EFEB]'
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#D9CFC4] bg-white text-[#201A15] hover:bg-[#F5EFEB] disabled:opacity-40 disabled:pointer-events-none transition-colors focus-accessible shadow-xs"
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
};
