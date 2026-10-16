'use client';

import React from 'react';
import {
  Wrench,
  Sofa,
  DoorClosed,
  LayoutGrid,
  Utensils,
  Sparkles,
  Store,
  Layers,
} from 'lucide-react';
import { ServiceCategoryKey } from '@/types/api';

interface ServicesFilterTabsProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  counts: Record<string, number>;
}

const CATEGORIES: { id: string; label: string; icon: any }[] = [
  { id: 'all', label: 'All Services', icon: Layers },
  { id: 'repair', label: 'Repairs & Maintenance', icon: Wrench },
  { id: 'custom_furniture', label: 'Custom Furniture', icon: Sofa },
  { id: 'doors_wardrobes', label: 'Doors & Wardrobes', icon: DoorClosed },
  { id: 'interiors', label: 'Modular Kitchens', icon: Utensils },
  { id: 'finishing', label: 'Finishing & Polishing', icon: Sparkles },
  { id: 'commercial', label: 'Commercial & Retail', icon: Store },
];

export const ServicesFilterTabs: React.FC<ServicesFilterTabsProps> = ({
  activeCategory,
  onSelectCategory,
  counts,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-2">
      <div className="flex items-center gap-2 min-w-max">
        {CATEGORIES.map((cat) => {
          const isSelected = activeCategory === cat.id;
          const count = counts[cat.id] ?? 0;
          const Icon = cat.icon;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#3E2312] text-white border-[#3E2312] shadow-xs'
                  : 'bg-white text-[#5C4D41] border-[#E5DDD1] hover:border-[#8B5A2B]/40 hover:bg-[#FAF7F2]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-[#8B5A2B]'}`} />
              <span>{cat.label}</span>
              {count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#F3ECE2] text-[#5C4D41]'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
