import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  // Generate page numbers
  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <nav
      className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-[#E5DDD1]"
      aria-label="Catalogue pagination"
    >
      <div className="text-xs text-[#5C4D41]">
        Showing <span className="font-semibold text-[#201A15]">{startItem}</span> to{' '}
        <span className="font-semibold text-[#201A15]">{endItem}</span> of{' '}
        <span className="font-semibold text-[#201A15]">{totalItems}</span> products
      </div>

      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-[#E5DDD1] bg-white text-[#201A15] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-accessible flex items-center gap-1 text-xs font-semibold"
          aria-label="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? 'page' : undefined}
            className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors focus-accessible ${
              p === currentPage
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'bg-white border border-[#E5DDD1] text-[#5C4D41] hover:bg-[#FAF7F2]'
            }`}
          >
            {p}
          </button>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-[#E5DDD1] bg-white text-[#201A15] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors focus-accessible flex items-center gap-1 text-xs font-semibold"
          aria-label="Next Page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
};
