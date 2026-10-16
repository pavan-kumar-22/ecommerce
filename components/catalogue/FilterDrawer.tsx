import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ServiceCategory, PriceMode } from '../../types/api';

export interface FilterState {
  category: string;
  priceMode: string;
  priceMin: string;
  priceMax: string;
  sort: string;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  currentFilters: FilterState;
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
  isMobileOnly?: boolean;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  categories,
  currentFilters,
  onApplyFilters,
  onResetFilters,
  isMobileOnly = false,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterState>(currentFilters);
  const [priceError, setPriceError] = useState<string | null>(null);

  useEffect(() => {
    setLocalFilters(currentFilters);
  }, [currentFilters]);

  // Handle ESC key for mobile modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const min = localFilters.priceMin ? parseFloat(localFilters.priceMin) : undefined;
    const max = localFilters.priceMax ? parseFloat(localFilters.priceMax) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      setPriceError('Minimum price cannot be greater than maximum price');
      return;
    }

    setPriceError(null);
    onApplyFilters(localFilters);
    onClose();
  };

  const handleReset = () => {
    setPriceError(null);
    onResetFilters();
    onClose();
  };

  const content = (
    <form onSubmit={handleApply} className="space-y-6">
      {/* 1. Category Filter */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B3F23] mb-3">
          Furniture Category
        </h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2.5 text-xs text-[#201A15] cursor-pointer">
            <input
              type="radio"
              name="category"
              value="all"
              checked={!localFilters.category || localFilters.category === 'all'}
              onChange={() => setLocalFilters({ ...localFilters, category: 'all' })}
              className="text-[#1E4D2B] focus:ring-[#2D6A4F]"
            />
            <span>All Categories</span>
          </label>
          {categories.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2.5 text-xs text-[#201A15] cursor-pointer"
            >
              <input
                type="radio"
                name="category"
                value={c.slug}
                checked={localFilters.category === c.slug}
                onChange={() => setLocalFilters({ ...localFilters, category: c.slug })}
                className="text-[#1E4D2B] focus:ring-[#2D6A4F]"
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 2. Price Mode Filter */}
      <div className="pt-4 border-t border-[#E5DDD1]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B3F23] mb-3">
          Pricing Type
        </h3>
        <div className="space-y-2">
          {[
            { value: 'all', label: 'All Pricing Modes' },
            { value: 'fixed', label: 'Fixed Price (Showroom)' },
            { value: 'starting_from', label: 'Starting Price Specified' },
            { value: 'quote_required', label: 'Custom Quote Only' },
          ].map((mode) => (
            <label
              key={mode.value}
              className="flex items-center gap-2.5 text-xs text-[#201A15] cursor-pointer"
            >
              <input
                type="radio"
                name="priceMode"
                value={mode.value}
                checked={
                  localFilters.priceMode === mode.value ||
                  (mode.value === 'all' && (!localFilters.priceMode || localFilters.priceMode === 'all'))
                }
                onChange={() => setLocalFilters({ ...localFilters, priceMode: mode.value })}
                className="text-[#1E4D2B] focus:ring-[#2D6A4F]"
              />
              <span>{mode.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 3. Price Range Filter (Only applies to comparable prices) */}
      <div className="pt-4 border-t border-[#E5DDD1]">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B3F23] mb-1.5">
          Comparable Price Range (₹)
        </h3>
        <p className="text-[11px] text-[#8C7E72] mb-3">
          Applies to fixed and starting price pieces.
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="priceMin" className="sr-only">
              Minimum Price in Rupees
            </label>
            <input
              id="priceMin"
              type="number"
              placeholder="Min ₹"
              value={localFilters.priceMin}
              onChange={(e) => {
                setPriceError(null);
                setLocalFilters({ ...localFilters, priceMin: e.target.value });
              }}
              min="0"
              step="1000"
              className="w-full text-xs p-2.5 bg-white border border-[#E5DDD1] rounded-lg focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            />
          </div>
          <div>
            <label htmlFor="priceMax" className="sr-only">
              Maximum Price in Rupees
            </label>
            <input
              id="priceMax"
              type="number"
              placeholder="Max ₹"
              value={localFilters.priceMax}
              onChange={(e) => {
                setPriceError(null);
                setLocalFilters({ ...localFilters, priceMax: e.target.value });
              }}
              min="0"
              step="1000"
              className="w-full text-xs p-2.5 bg-white border border-[#E5DDD1] rounded-lg focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F]"
            />
          </div>
        </div>
        {priceError && <p className="text-[11px] text-red-600 mt-2 font-medium">{priceError}</p>}
      </div>

      {/* 4. Action Buttons */}
      <div className="pt-6 border-t border-[#E5DDD1] flex flex-col gap-2.5">
        <button
          type="submit"
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#1E4D2B] text-white hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs text-center"
        >
          Apply Filters
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E5DDD1] text-[#6B3F23] hover:bg-[#EFE8DC] transition-colors focus-accessible flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </form>
  );

  // Desktop Static Sidebar Layout
  if (!isMobileOnly) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-[#E5DDD1] shadow-2xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E5DDD1]">
          <SlidersHorizontal className="w-4 h-4 text-[#6B3F23]" />
          <h2 className="text-sm font-bold text-[#201A15]">Filter Catalogue</h2>
        </div>
        {content}
      </div>
    );
  }

  // Mobile Slide-over Drawer Modal Layout
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Filter Options"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-2xs transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white shadow-xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-[#E5DDD1] mb-6">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#6B3F23]" />
              <h2 className="text-base font-bold text-[#201A15]">Filter Catalogue</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[#5C4D41] hover:text-[#201A15] hover:bg-[#EFE8DC] rounded-lg focus-accessible"
              aria-label="Close filter drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {content}
        </div>
      </div>
    </div>
  );
};
