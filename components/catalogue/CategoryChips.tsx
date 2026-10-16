import React from 'react';
import { ServiceCategory } from '../../types/api';

interface CategoryChipsProps {
  categories: ServiceCategory[];
  activeCategory?: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  activeCategory = 'all',
  onSelectCategory,
}) => {
  const allChips = [
    { slug: 'all', name: 'All Products' },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    <div
      className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2"
      role="tablist"
      aria-label="Filter products by category"
    >
      {allChips.map((chip) => {
        const isSelected =
          activeCategory === chip.slug || (chip.slug === 'all' && (!activeCategory || activeCategory === 'all'));

        return (
          <button
            key={chip.slug}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(chip.slug)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all focus-accessible shrink-0 shadow-2xs ${
              isSelected
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'bg-white border border-[#E5DDD1] text-[#5C4D41] hover:bg-[#FAF7F2] hover:border-[#6B3F23]/30'
            }`}
          >
            {chip.name}
          </button>
        );
      })}
    </div>
  );
};
