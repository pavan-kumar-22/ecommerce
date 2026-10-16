'use client';

import React, { useState, useEffect } from 'react';
import { CartSummary } from '@/types/api';
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  applyCartCoupon,
  removeCartCoupon,
  getGuestCartSessionId,
} from '@/lib/api-client';
import { CartBreadcrumbHeader } from '@/components/cart/CartBreadcrumbHeader';
import { CartItemRow } from '@/components/cart/CartItemRow';
import { CartSummaryCard } from '@/components/cart/CartSummaryCard';
import { CartEmptyState } from '@/components/cart/CartEmptyState';
import { CartStaleWarningBanner } from '@/components/cart/CartStaleWarningBanner';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { AlertCircle, Trash2 } from 'lucide-react';

export function CartClient() {
  const [cart, setCart] = useState<CartSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Item update states
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [isCouponLoading, setIsCouponLoading] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const sessionId = typeof window !== 'undefined' ? getGuestCartSessionId() : 'demo_guest_session';

  const loadCartData = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getCart(sessionId);
      setCart(data);
    } catch (err: any) {
      setLoadError(err.message || 'Failed to load shopping cart. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCartData();
  }, []);

  const handleUpdateQuantity = async (itemId: string, newQty: number) => {
    setUpdatingItemId(itemId);
    setActionError(null);
    try {
      const updated = await updateCartItem(itemId, newQty, sessionId);
      setCart(updated);
    } catch (err: any) {
      setActionError(err.message || 'Failed to update quantity.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setUpdatingItemId(itemId);
    setActionError(null);
    try {
      const updated = await removeCartItem(itemId, sessionId);
      setCart(updated);
    } catch (err: any) {
      setActionError(err.message || 'Failed to remove item from cart.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to empty your entire shopping cart?')) return;
    setIsLoading(true);
    try {
      const cleared = await clearCart(sessionId);
      setCart(cleared);
    } catch (err: any) {
      setActionError(err.message || 'Failed to clear cart.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = async (code: string) => {
    setIsCouponLoading(true);
    setCouponError(null);
    try {
      const updated = await applyCartCoupon(code, sessionId);
      setCart(updated);
    } catch (err: any) {
      setCouponError(err.message || 'Invalid promotional code.');
    } finally {
      setIsCouponLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setIsCouponLoading(true);
    try {
      const updated = await removeCartCoupon(sessionId);
      setCart(updated);
    } catch (err: any) {
      setActionError(err.message || 'Failed to remove coupon.');
    } finally {
      setIsCouponLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <CartBreadcrumbHeader itemCount={cart?.totalItemCount || 0} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <LoadingSkeleton variant="card" count={2} />
          </div>
        )}

        {/* Load Error State */}
        {!isLoading && loadError && (
          <ErrorState
            title="Unable to load your cart"
            message={loadError}
            onRetry={loadCartData}
          />
        )}

        {/* Loaded Cart Display */}
        {!isLoading && !loadError && cart && (
          <>
            {/* Stale Price or Availability Warning */}
            {cart.stalePriceWarning && (
              <CartStaleWarningBanner
                message={cart.stalePriceWarning}
                onRefresh={loadCartData}
              />
            )}

            {/* Action Error Alert */}
            {actionError && (
              <div
                role="alert"
                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between gap-3 text-xs sm:text-sm text-red-800"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{actionError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActionError(null)}
                  className="font-bold text-red-700 hover:underline shrink-0"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Empty State */}
            {cart.items.length === 0 ? (
              <CartEmptyState />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Cart Items List */}
                <section
                  aria-label="Selected cart items"
                  className="lg:col-span-7 space-y-4"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#F0EAE1]">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#6B5E55]">
                      Review Items ({cart.items.length})
                    </span>

                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="inline-flex items-center gap-1 text-xs text-[#8C7A6B] hover:text-red-600 transition-colors focus-accessible p-1 rounded-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear All</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {cart.items.map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        isUpdating={updatingItemId === item.id}
                      />
                    ))}
                  </div>
                </section>

                {/* Right Column: Price Summary & Checkout Card */}
                <aside
                  aria-label="Order summary and checkout"
                  className="lg:col-span-5 sticky top-24"
                >
                  <CartSummaryCard
                    cart={cart}
                    onApplyCoupon={handleApplyCoupon}
                    onRemoveCoupon={handleRemoveCoupon}
                    isCouponLoading={isCouponLoading}
                    couponError={couponError}
                  />
                </aside>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
