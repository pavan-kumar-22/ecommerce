import React from 'react';
import { PriceMode } from '../../types/api';

interface PriceDisplayProps {
  priceMode: PriceMode;
  salePricePaise?: number;
  startingPricePaise?: number;
  startingPrice?: number | null; // Compatibility
  currency?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceMode,
  salePricePaise,
  startingPricePaise,
  startingPrice,
  currency = 'INR',
  className = '',
  size = 'md',
}) => {
  // Convert paise to whole rupees safely
  const formatRupees = (rupees: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(rupees);
  };

  const getNumericPrice = (): number | null => {
    if (salePricePaise !== undefined && salePricePaise !== null) {
      return salePricePaise / 100;
    }
    if (startingPricePaise !== undefined && startingPricePaise !== null) {
      return startingPricePaise / 100;
    }
    if (startingPrice !== undefined && startingPrice !== null) {
      return startingPrice;
    }
    return null;
  };

  const priceVal = getNumericPrice();

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm font-bold',
    lg: 'text-lg font-bold',
  };

  // 1. Fixed Price Mode
  if (priceMode === 'fixed' && priceVal !== null) {
    return (
      <div className={`text-[#201A15] ${className}`} data-testid="price-fixed">
        <span className={`${sizeClasses[size]} text-[#201A15]`}>{formatRupees(priceVal)}</span>
      </div>
    );
  }

  // 2. Starting From Price Mode
  if (priceMode === 'starting_from' && priceVal !== null) {
    return (
      <div className={`text-[#201A15] ${className}`} data-testid="price-starting-from">
        <span className="text-[11px] text-[#6B3F23] font-medium block">Starting from</span>
        <span className={`${sizeClasses[size]} text-[#201A15]`}>{formatRupees(priceVal)}</span>
      </div>
    );
  }

  // 3. Custom Quote Required Mode (Strictly hides any misleading prices)
  return (
    <div className={`inline-block ${className}`} data-testid="price-quote-required">
      <span className="inline-flex items-center text-xs font-semibold text-[#6B3F23] bg-[#FAF3EB] px-2.5 py-1 rounded-md border border-[#EBDCCF]">
        Quote Required
      </span>
    </div>
  );
};
