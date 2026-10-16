'use client';

import React from 'react';
import { Trees, Sparkles, Layers, Minus, Plus } from 'lucide-react';
import { ProductSizeOption } from '../../types/api';

interface OptionsSelectorProps {
  woodSpeciesList: string[];
  selectedWood: string;
  onSelectWood: (wood: string) => void;

  finishesList: string[];
  selectedFinish: string;
  onSelectFinish: (finish: string) => void;

  sizesList?: ProductSizeOption[];
  selectedSizeId?: string;
  onSelectSize?: (sizeId: string) => void;

  quantity: number;
  onChangeQuantity: (qty: number) => void;
  maxQuantity?: number;
}

export const OptionsSelector: React.FC<OptionsSelectorProps> = ({
  woodSpeciesList,
  selectedWood,
  onSelectWood,
  finishesList,
  selectedFinish,
  onSelectFinish,
  sizesList = [],
  selectedSizeId,
  onSelectSize,
  quantity,
  onChangeQuantity,
  maxQuantity = 10,
}) => {
  const handleDecQty = () => {
    if (quantity > 1) onChangeQuantity(quantity - 1);
  };

  const handleIncQty = () => {
    if (quantity < maxQuantity) onChangeQuantity(quantity + 1);
  };

  return (
    <div className="space-y-5">
      {/* 1. Size Options (if available) */}
      {sizesList.length > 0 && onSelectSize && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B3F23] mb-2.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Select Bed / Table Size</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {sizesList.map((sz) => {
              const isSelected = sz.id === selectedSizeId;
              return (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => onSelectSize(sz.id)}
                  aria-pressed={isSelected}
                  className={`p-3 rounded-xl border text-left transition-all focus-accessible ${
                    isSelected
                      ? 'border-[#1E4D2B] bg-[#E8F2EC] text-[#1E4D2B] ring-1 ring-[#1E4D2B]'
                      : 'border-[#E5DDD1] bg-white text-[#201A15] hover:border-[#6B3F23]'
                  }`}
                >
                  <span className="block text-xs font-bold">{sz.label}</span>
                  <span className="block text-[11px] text-[#5C4D41] mt-0.5">
                    {sz.dimensionsSummary}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Wood Species Selector */}
      {woodSpeciesList.length > 0 && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B3F23] mb-2.5">
            <Trees className="w-3.5 h-3.5" />
            <span>Timber Species: <span className="font-semibold text-[#201A15] normal-case">{selectedWood}</span></span>
          </label>
          <div className="flex flex-wrap gap-2">
            {woodSpeciesList.map((species) => {
              const isSelected = species === selectedWood;
              return (
                <button
                  key={species}
                  type="button"
                  onClick={() => onSelectWood(species)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all focus-accessible flex items-center gap-2 ${
                    isSelected
                      ? 'border-[#1E4D2B] bg-[#E8F2EC] text-[#1E4D2B] shadow-2xs'
                      : 'border-[#E5DDD1] bg-white text-[#5C4D41] hover:text-[#201A15] hover:border-[#6B3F23]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? 'bg-[#1E4D2B]' : 'bg-[#C2A68C]'
                    }`}
                  />
                  <span>{species}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Finish / Polish Selector */}
      {finishesList.length > 0 && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B3F23] mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Surface Finish & Polish: <span className="font-semibold text-[#201A15] normal-case">{selectedFinish}</span></span>
          </label>
          <div className="flex flex-wrap gap-2">
            {finishesList.map((finish) => {
              const isSelected = finish === selectedFinish;
              return (
                <button
                  key={finish}
                  type="button"
                  onClick={() => onSelectFinish(finish)}
                  aria-pressed={isSelected}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all focus-accessible ${
                    isSelected
                      ? 'border-[#1E4D2B] bg-[#E8F2EC] text-[#1E4D2B] shadow-2xs'
                      : 'border-[#E5DDD1] bg-white text-[#5C4D41] hover:text-[#201A15] hover:border-[#6B3F23]'
                  }`}
                >
                  {finish}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Quantity Selector */}
      <div className="pt-2 flex items-center justify-between border-t border-[#E5DDD1]">
        <div>
          <span className="block text-xs font-bold text-[#201A15]">Quantity</span>
          <span className="text-[11px] text-[#8C7E72]">
            Workshop crafted units (max {maxQuantity} per batch)
          </span>
        </div>

        <div className="flex items-center border border-[#E5DDD1] bg-white rounded-xl shadow-2xs overflow-hidden">
          <button
            type="button"
            onClick={handleDecQty}
            disabled={quantity <= 1}
            className="p-2.5 text-[#5C4D41] hover:text-[#201A15] disabled:opacity-40 transition-colors focus-accessible"
            aria-label="Decrease quantity"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span
            className="w-10 text-center text-xs font-bold text-[#201A15]"
            aria-live="polite"
            data-testid="quantity-display"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncQty}
            disabled={quantity >= maxQuantity}
            className="p-2.5 text-[#5C4D41] hover:text-[#201A15] disabled:opacity-40 transition-colors focus-accessible"
            aria-label="Increase quantity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
