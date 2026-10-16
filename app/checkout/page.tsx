import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CheckoutClient } from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout & Site-Visit Booking | Vuyyuru Carpentry',
  description:
    'Complete your fixed-price handcrafted furniture order or book an artisan site-visit for repairs and custom carpentry in Vuyyuru and Krishna District.',
  keywords: [
    'checkout carpentry order',
    'buy teak bed Vuyyuru',
    'book carpenter visit Krishna district',
    'carpentry site visit Andhra Pradesh',
    'furniture delivery Vuyyuru',
  ],
  openGraph: {
    title: 'Checkout & Booking · Vuyyuru Carpentry',
    description:
      'Place your verified fixed-price furniture order or request an artisan site visit. Handcrafted joinery and transparent pricing in Vuyyuru.',
    url: 'https://vuyyurucarpentry.com/checkout',
    type: 'website',
  },
};

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-stone-50 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-amber-800 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-stone-600 font-medium">Loading checkout & booking...</p>
          </div>
        </div>
      }
    >
      <CheckoutClient />
    </Suspense>
  );
}
