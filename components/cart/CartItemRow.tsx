'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CartItem } from '@/types/api';
import { Trash2, AlertTriangle, ArrowRight, Loader2, Minus, Plus } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (itemId: string, newQty: number) => Promise<void>;
  onRemoveItem: (itemId: string) => Promise<void>;
  isUpdating: boolean;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  isUpdating,
}) => {
  const [localQty, setLocalQty] = useState(item.quantity.toString());
  const [isRemoving, setIsRemoving] = useState(false);

  const formattedUnitPrice = (item.pricePaise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const formattedLineTotal = (item.lineTotalPaise / 100).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });

  const handleStep = async (delta: number) => {
    const nextQty = item.quantity + delta;
    if (nextQty >= 1 && nextQty <= 10) {
      setLocalQty(nextQty.toString());
      await onUpdateQuantity(item.id, nextQty);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQty(e.target.value);
  };

  const handleInputBlur = async () => {
    const parsed = parseInt(localQty, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
      if (parsed !== item.quantity) {
        await onUpdateQuantity(item.id, parsed);
      }
    } else {
      // Revert to valid server quantity
      setLocalQty(item.quantity.toString());
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await onRemoveItem(item.id);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div
      data-testid={`cart-item-${item.id}`}
      className={`p-4 sm:p-6 bg-white rounded-2xl border transition-all ${
        !item.isEligible
          ? 'border-amber-300 bg-amber-50/20 shadow-xs'
          : 'border-[#E5DDD1] hover:border-[#D9CFC4] shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-[#FAF7F2] shrink-0 border border-[#E5DDD1]">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Product Details & Scope */}
        <div className="flex-1 min-w-0 w-full space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8C7A6B] block">
                {item.category}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15] hover:text-[#1E4D2B] transition-colors">
                <Link href={`/products/${item.slug}`}>{item.name}</Link>
              </h3>
            </div>

            {/* Desktop Line Total */}
            <div className="text-right hidden sm:block">
              <span className="text-xs text-[#8C7A6B] block">Line Total</span>
              <span className="font-mono text-base sm:text-lg font-bold text-[#1E4D2B]">
                {formattedLineTotal}
              </span>
            </div>
          </div>

          {/* Configuration Options Badges */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#5C4D41]">
            {item.selectedWoodSpecies && (
              <span className="bg-[#FAF7F2] border border-[#E5DDD1] px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                Timber: {item.selectedWoodSpecies}
              </span>
            )}
            {item.selectedFinish && (
              <span className="bg-[#FAF7F2] border border-[#E5DDD1] px-2.5 py-0.5 rounded-md text-[11px] font-medium">
                Finish: {item.selectedFinish}
              </span>
            )}
            {item.dimensionsSummary && (
              <span className="text-[11px] text-[#8C7A6B]">
                ({item.dimensionsSummary})
              </span>
            )}
          </div>

          {/* Unit Price */}
          <div className="text-xs text-[#6B5E55]">
            <span>Unit Price: </span>
            <span className="font-semibold text-[#201A15]">{formattedUnitPrice}</span>
          </div>

          {/* Ineligible Warning Notice */}
          {!item.isEligible && (
            <div
              role="alert"
              className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">Checkout Not Permitted</span>
                <p>{item.eligibilityReason}</p>
                <div className="pt-1 flex items-center gap-3">
                  <Link
                    href={`/custom-furniture?product=${item.slug}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E4D2B] hover:underline"
                  >
                    <span>Request Custom Quote</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-[11px] text-red-600 font-bold hover:underline"
                  >
                    Remove from cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stale Price Changed Notice */}
          {item.priceChanged && item.originalPricePaise && (
            <div className="mt-2 text-xs text-[#D97706] bg-[#FFFBEB] p-2.5 rounded-lg border border-[#FDE68A] flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Price updated based on latest timber market index (formerly ₹
                {(item.originalPricePaise / 100).toLocaleString('en-IN')}).
              </span>
            </div>
          )}

          {/* Controls Row: Quantity & Remove */}
          <div className="pt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[#F5EFEB]">
            {/* Quantity Stepper */}
            <div className="flex items-center gap-2">
              <label htmlFor={`qty-input-${item.id}`} className="text-xs font-bold text-[#3E2312]">
                Qty:
              </label>

              <div className="inline-flex items-center border border-[#D9CFC4] rounded-xl bg-[#FAF7F2] overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleStep(-1)}
                  disabled={item.quantity <= 1 || isUpdating}
                  className="px-2.5 py-1.5 text-[#5C4D41] hover:bg-[#EFE8DC] hover:text-[#201A15] transition-colors disabled:opacity-30 disabled:pointer-events-none focus-accessible"
                  aria-label={`Decrease quantity of ${item.name}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  type="number"
                  id={`qty-input-${item.id}`}
                  min={1}
                  max={10}
                  value={localQty}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  disabled={isUpdating}
                  className="w-10 text-center text-xs font-bold text-[#201A15] bg-transparent focus:outline-hidden"
                  aria-label={`Quantity of ${item.name}`}
                />

                <button
                  type="button"
                  onClick={() => handleStep(1)}
                  disabled={item.quantity >= 10 || isUpdating}
                  className="px-2.5 py-1.5 text-[#5C4D41] hover:bg-[#EFE8DC] hover:text-[#201A15] transition-colors disabled:opacity-30 disabled:pointer-events-none focus-accessible"
                  aria-label={`Increase quantity of ${item.name}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1E4D2B]" />}
            </div>

            {/* Mobile Line Total */}
            <div className="sm:hidden font-mono text-sm font-bold text-[#1E4D2B]">
              Total: {formattedLineTotal}
            </div>

            {/* Remove Action Button */}
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving || isUpdating}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7A6B] hover:text-red-600 transition-colors focus-accessible p-1 rounded-sm disabled:opacity-50"
              aria-label={`Remove ${item.name} from cart`}
            >
              {isRemoving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
