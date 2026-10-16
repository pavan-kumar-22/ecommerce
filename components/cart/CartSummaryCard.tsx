'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CartSummary } from '@/types/api';
import { ShieldCheck, ArrowRight, Tag, X, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

interface CartSummaryCardProps {
  cart: CartSummary;
  onApplyCoupon: (code: string) => Promise<void>;
  onRemoveCoupon: () => Promise<void>;
  isCouponLoading: boolean;
  couponError: string | null;
}

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  cart,
  onApplyCoupon,
  onRemoveCoupon,
  isCouponLoading,
  couponError,
}) => {
  const [couponCode, setCouponCode] = useState('');

  const formatPrice = (paise: number) => {
    return (paise / 100).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    });
  };

  const handleCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    await onApplyCoupon(couponCode.trim());
    setCouponCode('');
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD1] p-6 sm:p-8 shadow-xs space-y-6">
      <div className="border-b border-[#F0EAE1] pb-4">
        <h2 className="font-serif text-xl font-bold text-[#201A15]">
          Price Summary
        </h2>
        <p className="text-xs text-[#8C7A6B] mt-0.5">
          Calculated authoritatively by Vuyyuru joinery workshop server
        </p>
      </div>

      {/* Itemized Calculations */}
      <div className="space-y-3.5 text-sm">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-[#4A3E36]">
          <span>Subtotal ({cart.totalItemCount} {cart.totalItemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-mono font-bold text-[#201A15]">
            {formatPrice(cart.subtotalPaise)}
          </span>
        </div>

        {/* Delivery / Shipping Charges */}
        <div className="flex items-start justify-between text-[#4A3E36] gap-4">
          <div>
            <span>Delivery / Dispatch</span>
            <span className="block text-[11px] text-[#8C7A6B] leading-tight">
              {cart.deliveryNotice}
            </span>
          </div>
          <span className="font-mono font-bold text-[#1E4D2B] shrink-0">
            {cart.deliveryChargesPaise === 0 ? 'FREE' : formatPrice(cart.deliveryChargesPaise)}
          </span>
        </div>

        {/* Taxes */}
        <div className="flex items-start justify-between text-[#4A3E36] gap-4">
          <div>
            <span>Taxes & GST</span>
            <span className="block text-[11px] text-[#8C7A6B] leading-tight">
              {cart.taxNotice}
            </span>
          </div>
          <span className="font-mono font-medium text-[#6B5E55] shrink-0">
            {cart.taxPaise === 0 ? 'Included' : formatPrice(cart.taxPaise)}
          </span>
        </div>

        {/* Applied Discount */}
        {cart.discountPaise > 0 && (
          <div className="flex items-center justify-between text-[#1E4D2B] bg-[#F0FDF4] p-2.5 rounded-xl border border-[#BBF7D0]">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <Tag className="w-3.5 h-3.5" />
              <span>Coupon ({cart.appliedCouponCode})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold">
                -{formatPrice(cart.discountPaise)}
              </span>
              <button
                type="button"
                onClick={onRemoveCoupon}
                className="text-[#8C7A6B] hover:text-red-600 p-0.5"
                aria-label="Remove applied coupon"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Promotional Coupon Form */}
      {!cart.appliedCouponCode && (
        <form onSubmit={handleCouponSubmit} className="pt-2 border-t border-[#F0EAE1]">
          <label htmlFor="coupon-input" className="block text-xs font-bold text-[#3E2312] mb-1.5">
            Promo Code / Workshop Coupon
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="coupon-input"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="e.g. VUYYURU2026"
              className="flex-1 px-3 py-2 rounded-xl border border-[#D9CFC4] text-xs text-[#201A15] bg-[#FAF7F2] uppercase focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B]"
            />
            <button
              type="submit"
              disabled={isCouponLoading || !couponCode.trim()}
              className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#EFE8DC] border border-[#D9CFC4] text-xs font-bold text-[#201A15] transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {isCouponLoading ? 'Applying...' : 'Apply'}
            </button>
          </div>
          {couponError && (
            <p className="mt-1.5 text-xs text-red-600 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{couponError}</span>
            </p>
          )}
        </form>
      )}

      {/* Estimated Total Calculation */}
      <div className="pt-4 border-t border-[#F0EAE1] space-y-1">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="font-serif text-base font-bold text-[#201A15] block">
              Estimated Total
            </span>
            <span className="text-[11px] text-[#8C7A6B]">
              Final checkout validation required
            </span>
          </div>
          <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#1E4D2B]">
            {formatPrice(cart.estimatedTotalPaise)}
          </span>
        </div>
      </div>

      {/* Ineligible Items Callout */}
      {cart.hasIneligibleItems && (
        <div
          role="alert"
          className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 leading-relaxed"
        >
          <span className="font-bold block mb-0.5">Checkout Blocked</span>
          Your cart contains items that require on-site measurement or custom written quotes. Please resolve or remove ineligible items before continuing.
        </div>
      )}

      {/* Checkout CTA Actions */}
      <div className="space-y-3 pt-2">
        <Link
          href={cart.canCheckout ? '/checkout' : '#'}
          aria-disabled={!cart.canCheckout}
          tabIndex={cart.canCheckout ? 0 : -1}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
            cart.canCheckout
              ? 'bg-[#1E4D2B] hover:bg-[#2D6A4F] focus-accessible'
              : 'bg-[#9CA3AF] cursor-not-allowed pointer-events-none opacity-60'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Continue to Checkout</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/products"
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D9CFC4] bg-[#FAF7F2] hover:bg-[#EFE8DC] text-xs font-bold text-[#4A3E36] transition-colors focus-accessible text-center"
        >
          <span>Continue Shopping</span>
        </Link>
      </div>

      {/* Reassurance Disclaimer Box */}
      <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-[#E5DDD1] text-[11px] text-[#6B5E55] leading-relaxed flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-[#1E4D2B] shrink-0 mt-0.5" />
        <span>
          <strong>Cart Notice:</strong> The cart is not a confirmed order, invoice, or reservation. Selected prices and timber stock availability are revalidated during checkout.
        </span>
      </div>
    </div>
  );
};
