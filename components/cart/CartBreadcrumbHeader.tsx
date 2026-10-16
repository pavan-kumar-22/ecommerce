import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

interface CartBreadcrumbHeaderProps {
  itemCount: number;
}

export const CartBreadcrumbHeader: React.FC<CartBreadcrumbHeaderProps> = ({ itemCount }) => {
  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumbs"
        className="bg-[#F5EFEB] border-b border-[#E5DDD1] py-3 text-xs text-[#6B5E55]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                href="/"
                className="hover:text-[#1E4D2B] transition-colors flex items-center gap-1 focus-accessible rounded-xs"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-[#A89A8E]" />
            <li aria-current="page" className="font-semibold text-[#201A15]">
              Cart
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative bg-[#201A15] text-[#FAF7F2] py-10 sm:py-14 overflow-hidden border-b border-[#3E2312]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,106,79,0.22),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#1E4D2B]/80 text-[#FAF7F2] text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-[#2D6A4F]/60">
              <ShieldCheck className="w-4 h-4 text-[#A5D6A7]" />
              <span>Direct Workshop Purchase · Krishna District</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 leading-tight">
              Your Shopping Cart
            </h1>

            <p className="text-sm sm:text-base text-[#D9CFC4] leading-relaxed mb-4">
              Review your selected fixed-price furniture, confirm timber options, and inspect accurate costs before continuing to checkout.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-[#E5DDD1]">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-[#A5D6A7]" />
                <span>{itemCount} {itemCount === 1 ? 'eligible item' : 'eligible items'} in cart</span>
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Vuyyuru Local Dispatch Available</span>
              </span>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
