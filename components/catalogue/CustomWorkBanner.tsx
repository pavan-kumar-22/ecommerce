import React from 'react';
import Link from 'next/link';
import { Ruler, ArrowRight, Sparkles } from 'lucide-react';

export const CustomWorkBanner: React.FC = () => {
  return (
    <aside
      className="my-10 bg-gradient-to-r from-[#F5EFE6] via-[#FAF7F2] to-[#EFE8DC] border border-[#E5DDD1] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs"
      aria-labelledby="custom-work-banner-title"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-[#E8F2EC] text-[#1E4D2B] flex items-center justify-center shrink-0">
          <Ruler className="w-6 h-6 text-[#2D6A4F]" aria-hidden="true" />
        </div>
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6B3F23] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Made-to-Measure Carpentry</span>
          </div>
          <h3 id="custom-work-banner-title" className="text-base sm:text-lg font-bold text-[#201A15]">
            Have a different room size or bespoke design in mind?
          </h3>
          <p className="text-xs sm:text-sm text-[#5C4D41] mt-1 max-w-xl leading-relaxed">
            Every home in Andhra Pradesh has unique dimensions. Specify your required wood species
            (Burma/CP Teak, BWP ply), size in feet/inches, and get a transparent itemized quotation.
          </p>
        </div>
      </div>

      <Link
        href="/custom-furniture"
        className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E4D2B] text-white text-xs sm:text-sm font-semibold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-sm group"
        id="catalogue-custom-banner-cta"
      >
        <span>Request custom furniture</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </aside>
  );
};
