'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, ShieldCheck, ShoppingBag, CalendarClock, AlertTriangle } from 'lucide-react';
import { CartSummary, CheckoutMode, PublicService } from '@/types/api';
import { CheckoutModeToggle } from '@/components/checkout/CheckoutModeToggle';
import { ModeAFixedPriceCheckout } from '@/components/checkout/ModeAFixedPriceCheckout';
import { ModeBServiceVisitBooking } from '@/components/checkout/ModeBServiceVisitBooking';
import { getCart, getGuestCartSessionId } from '@/lib/api-client';
import { masterServicesDatabase } from '@/lib/public-data';

interface CheckoutClientProps {
  initialCart?: CartSummary | null;
  initialServices?: PublicService[];
}

export const CheckoutClient: React.FC<CheckoutClientProps> = ({
  initialCart,
  initialServices,
}) => {
  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');
  const serviceParam = searchParams.get('service');

  // Determine initial mode based on query param or cart contents
  const [activeMode, setActiveMode] = useState<CheckoutMode>(() => {
    if (modeParam === 'service_visit') return 'service_visit';
    if (modeParam === 'fixed_price') return 'fixed_price';
    // Default to fixed_price if cart has items, else service_visit
    if (initialCart && initialCart.items.length > 0) return 'fixed_price';
    return 'fixed_price';
  });

  const [cart, setCart] = useState<CartSummary | null>(initialCart || null);
  const [services, setServices] = useState<PublicService[]>(
    initialServices && initialServices.length > 0
      ? initialServices
      : (masterServicesDatabase as any[])
  );
  const [isLoadingCart, setIsLoadingCart] = useState(!initialCart);

  // Sync mode if query param changes
  useEffect(() => {
    if (modeParam === 'service_visit') {
      setActiveMode('service_visit');
    } else if (modeParam === 'fixed_price') {
      setActiveMode('fixed_price');
    }
  }, [modeParam]);

  // Load client-side cart session
  useEffect(() => {
    let isMounted = true;
    async function loadCartData() {
      try {
        const guestSessionId = getGuestCartSessionId();
        const activeCart = await getCart(guestSessionId);
        if (isMounted) {
          setCart(activeCart);
        }
      } catch (err) {
        console.warn('Could not sync cart session in checkout:', err);
      } finally {
        if (isMounted) setIsLoadingCart(false);
      }
    }

    loadCartData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <ol className="flex items-center space-x-2 text-xs sm:text-sm text-stone-500">
          <li>
            <Link href="/" className="hover:text-amber-800 transition-colors">
              Home
            </Link>
          </li>
          <li className="flex items-center">
            <ChevronRight className="w-3.5 h-3.5 mx-1 text-stone-400" />
            <Link href="/cart" className="hover:text-amber-800 transition-colors">
              Cart
            </Link>
          </li>
          <li className="flex items-center text-stone-900 font-semibold">
            <ChevronRight className="w-3.5 h-3.5 mx-1 text-stone-400" />
            <span>Checkout & Booking</span>
          </li>
        </ol>
      </nav>

      {/* Hero Header */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30 mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>DIRECT WORKSHOP TRANSACTION · VUYYURU</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
              Checkout & Booking
            </h1>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Finalize your fixed-price furniture order or schedule an on-site artisan assessment for repairs and custom joinery.
            </p>
          </div>

          <div
            className="absolute -right-10 -bottom-10 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Transaction Mode Selector Toggle */}
        <CheckoutModeToggle
          activeMode={activeMode}
          onModeChange={(newMode) => setActiveMode(newMode)}
          cartItemCount={cart?.totalItemCount || 0}
        />

        {/* Mode A: Fixed-Price Checkout Panel */}
        <div
          id="fixed-price-checkout-panel"
          role="tabpanel"
          aria-labelledby="mode-fixed-price-tab"
          hidden={activeMode !== 'fixed_price'}
        >
          {activeMode === 'fixed_price' && (
            <ModeAFixedPriceCheckout
              initialItems={cart?.items || []}
              sessionId={cart?.guestSessionId || 'demo_guest_session'}
            />
          )}
        </div>

        {/* Mode B: Service Visit Request Panel */}
        <div
          id="service-visit-booking-panel"
          role="tabpanel"
          aria-labelledby="mode-service-visit-tab"
          hidden={activeMode !== 'service_visit'}
        >
          {activeMode === 'service_visit' && (
            <ModeBServiceVisitBooking
              initialServiceSlug={serviceParam || undefined}
              servicesList={services}
            />
          )}
        </div>
      </main>
    </div>
  );
};
