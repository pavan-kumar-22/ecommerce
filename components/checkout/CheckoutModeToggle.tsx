'use client';

import React from 'react';
import { ShoppingBag, CalendarClock, ShieldCheck } from 'lucide-react';
import { CheckoutMode } from '@/types/api';

interface CheckoutModeToggleProps {
  activeMode: CheckoutMode;
  onModeChange: (mode: CheckoutMode) => void;
  cartItemCount: number;
}

export const CheckoutModeToggle: React.FC<CheckoutModeToggleProps> = ({
  activeMode,
  onModeChange,
  cartItemCount,
}) => {
  return (
    <div className="w-full mb-8">
      {/* Notice distinguishing the two transactions */}
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-xl p-4 mb-6 text-sm text-stone-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <strong className="text-amber-900 font-semibold">Separate Transactions Notice:</strong>{' '}
            Purchasing fixed-price workshop furniture and booking a carpenter site-visit are different workflows. Select your transaction below.
          </p>
        </div>
      </div>

      {/* Toggle Tabs */}
      <div
        role="tablist"
        aria-label="Checkout & Booking Transaction Modes"
        className="grid grid-cols-1 md:grid-cols-2 gap-3 p-1.5 bg-stone-100 rounded-2xl border border-stone-200"
      >
        {/* Mode A: Fixed-Price Order */}
        <button
          role="tab"
          type="button"
          id="mode-fixed-price-tab"
          aria-selected={activeMode === 'fixed_price'}
          aria-controls="fixed-price-checkout-panel"
          onClick={() => onModeChange('fixed_price')}
          className={`flex items-center gap-3.5 px-5 py-4 rounded-xl text-left transition-all duration-200 ${
            activeMode === 'fixed_price'
              ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-medium'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50/60'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              activeMode === 'fixed_price'
                ? 'bg-amber-800 text-amber-50'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base">Mode A: Fixed-Price Order</span>
              {cartItemCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  {cartItemCount} {cartItemCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5 truncate">
              Checkout verified solid-wood furniture currently in your cart.
            </p>
          </div>
        </button>

        {/* Mode B: Service Visit Request */}
        <button
          role="tab"
          type="button"
          id="mode-service-visit-tab"
          aria-selected={activeMode === 'service_visit'}
          aria-controls="service-visit-booking-panel"
          onClick={() => onModeChange('service_visit')}
          className={`flex items-center gap-3.5 px-5 py-4 rounded-xl text-left transition-all duration-200 ${
            activeMode === 'service_visit'
              ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80 font-medium'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50/60'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              activeMode === 'service_visit'
                ? 'bg-emerald-800 text-emerald-50'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            <CalendarClock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-base">Mode B: Service Visit Request</span>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                On-Site Visit
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5 truncate">
              Request a carpenter inspection for repairs, fittings, or custom work.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};
