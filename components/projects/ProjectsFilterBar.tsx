'use client';

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export interface CategoryOption {
  id: string;
  label: string;
  count?: number;
}

interface ProjectsFilterBarProps {
  categories: CategoryOption[];
  activeCategory: string;
  onSelectCategory: (categoryId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
}

export const ProjectsFilterBar: React.FC<ProjectsFilterBarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  totalResults,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E5DDD1] p-4 sm:p-5 shadow-xs mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Tabs */}
        <div
          role="tablist"
          aria-label="Project categories"
          className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                role="tab"
                id={`project-tab-${cat.id}`}
                aria-selected={isActive}
                onClick={() => onSelectCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all focus-accessible flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-[#1E4D2B] text-white shadow-xs'
                    : 'bg-[#F9F6F0] text-[#5C4D41] hover:bg-[#EFE8DC] hover:text-[#201A15]'
                }`}
              >
                <span>{cat.label}</span>
                {cat.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/25 text-white' : 'bg-[#E5DDD1] text-[#3E2312]'
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search Input & Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C7A6B]" />
            <input
              type="text"
              id="projects-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search wood, location, type..."
              className="w-full pl-9 pr-8 py-2 bg-[#FAF7F2] border border-[#D9CFC4] rounded-xl text-xs sm:text-sm text-[#201A15] placeholder:text-[#8C7A6B] focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B] focus:border-[#1E4D2B]"
              aria-label="Search projects by keyword, timber or location"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-[#201A15] focus-accessible p-0.5 rounded-sm"
                aria-label="Clear project search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-[#6B3F23] bg-[#F5EFEB] px-3 py-2 rounded-xl border border-[#E5DDD1] whitespace-nowrap">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>
              {totalResults} {totalResults === 1 ? 'Project' : 'Projects'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
