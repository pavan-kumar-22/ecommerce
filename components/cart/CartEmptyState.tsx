import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Sparkles, Compass } from 'lucide-react';

export const CartEmptyState: React.FC = () => {
  return (
    <div
      data-testid="cart-empty-state"
      className="bg-white rounded-3xl border border-[#E5DDD1] p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-xs space-y-6"
    >
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#FAF7F2] border border-[#E5DDD1] flex items-center justify-center mx-auto text-[#8C7A6B]">
        <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-[#1E4D2B]" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15]">
          Your Cart is Currently Empty
        </h2>
        <p className="text-sm text-[#6B5E55] max-w-md mx-auto leading-relaxed">
          You haven&apos;t added any ready-made furniture pieces yet. Browse our fixed-price collections or request a custom quotation tailored to your room dimensions.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
        <Link
          href="/products"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1E4D2B] hover:bg-[#2D6A4F] text-white px-6 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-colors focus-accessible"
        >
          <Sparkles className="w-4 h-4" />
          <span>Browse Ready Furniture</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/custom-furniture"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-[#D9CFC4] bg-[#FAF7F2] hover:bg-[#EFE8DC] text-[#201A15] px-6 py-3 rounded-xl font-bold text-xs sm:text-sm transition-colors focus-accessible"
        >
          <Compass className="w-4 h-4 text-[#8C7A6B]" />
          <span>Request Custom Furniture</span>
        </Link>
      </div>

      <div className="pt-6 border-t border-[#F0EAE1] text-xs text-[#8C7A6B]">
        <span>Looking for repairs or an on-site visit? </span>
        <Link href="/contact" className="font-bold text-[#1E4D2B] hover:underline">
          Book a site inspection
        </Link>
      </div>
    </div>
  );
};
