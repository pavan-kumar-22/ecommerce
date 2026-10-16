import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CartClient } from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart | Vuyyuru Carpentry',
  description:
    'Review your selected handcrafted teakwood furniture, configure options, inspect authoritative pricing, and proceed to checkout with Vuyyuru Carpentry.',
  keywords: [
    'carpentry cart',
    'buy teak furniture Vuyyuru',
    'teak bed order Krishna district',
    'woodwork checkout Andhra Pradesh',
  ],
  openGraph: {
    title: 'Shopping Cart · Vuyyuru Carpentry',
    description:
      'Review your selected fixed-price furniture before proceeding to secure checkout. Handcrafted by master artisans in Vuyyuru, Andhra Pradesh.',
    url: 'https://vuyyurucarpentry.com/cart',
    type: 'website',
  },
};

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1E4D2B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#5C4D41] font-medium">Loading your shopping cart...</p>
          </div>
        </div>
      }
    >
      <CartClient />
    </Suspense>
  );
}
