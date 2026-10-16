'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, MapPin, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

interface AboutHeroSectionProps {
  headline: string;
  subheading: string;
  businessName: string;
}

export const AboutHeroSection: React.FC<AboutHeroSectionProps> = ({
  headline,
  subheading,
  businessName,
}) => {
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
                className="hover:text-[#1E4D2B] transition-colors flex items-center gap-1 focus-accessible rounded-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-[#A89A8E]" />
            <li aria-current="page" className="font-semibold text-[#201A15]">
              About the Business
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Banner */}
      <header className="relative bg-[#201A15] text-[#FAF7F2] py-14 sm:py-20 overflow-hidden border-b border-[#3E2312]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,106,79,0.22),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#1E4D2B]/80 text-[#FAF7F2] text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-[#2D6A4F]/60">
              <ShieldCheck className="w-4 h-4 text-[#A5D6A7]" />
              <span>Grounded Local Craftsmanship · Vuyyuru, Andhra Pradesh</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              {headline}
            </h1>

            <p className="text-sm sm:text-base text-[#D9CFC4] leading-relaxed mb-8">
              {subheading}
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/custom-furniture"
                id="about-hero-quote-cta"
                className="inline-flex items-center gap-2 bg-[#1E4D2B] hover:bg-[#2D6A4F] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all focus-accessible"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request a Custom Quote</span>
              </Link>

              <Link
                href="/services"
                id="about-hero-services-cta"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-[#FAF7F2] px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/20 transition-all focus-accessible"
              >
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/projects"
                id="about-hero-projects-cta"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-[#FAF7F2] px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/20 transition-all focus-accessible"
              >
                <span>View Real Projects</span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
