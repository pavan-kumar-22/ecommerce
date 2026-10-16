import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, ArrowRight } from 'lucide-react';
import { PublicHeroSettings } from '../types/api';

interface HeroSectionProps {
  hero: PublicHeroSettings;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  return (
    <section
      className="relative overflow-hidden pt-8 pb-16 sm:pt-12 sm:pb-24 border-b border-[#E5DDD1] bg-gradient-to-b from-[#FAF7F2] to-[#F5EFE6]"
      aria-labelledby="hero-main-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Actionable CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Verified Location Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8F2EC] border border-[#D5E5DA] text-[#1E4D2B] text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" aria-hidden="true" />
              <span>{hero.badge}</span>
            </div>

            {/* Main Heading */}
            <h1
              id="hero-main-heading"
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#201A15] leading-[1.15]"
            >
              {hero.heading}
            </h1>

            {/* Subheading / Services Summary */}
            <p className="text-base sm:text-lg text-[#5C4D41] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {hero.subheading}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href={hero.primaryCtaLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold bg-[#1E4D2B] text-white hover:bg-[#2D6A4F] transition-all shadow-md hover:shadow-lg focus-accessible group"
                id="hero-primary-cta"
              >
                <span>{hero.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href={hero.secondaryCtaLink}
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl text-base font-semibold bg-[#FFFFFF] text-[#3E2312] border border-[#E5DDD1] hover:bg-[#FAF7F2] hover:border-[#6B3F23]/40 transition-colors focus-accessible shadow-xs"
                id="hero-secondary-cta"
              >
                {hero.secondaryCtaText}
              </Link>
            </div>

            {/* Verification Guarantee Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-[#6B3F23]">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
                Genuine Seasoned Timber
              </span>
              <span className="text-[#DDD4C4]">•</span>
              <span>Transparent Itemized Estimates</span>
              <span className="text-[#DDD4C4]">•</span>
              <span>Milestone-Based Payments</span>
            </div>
          </div>

          {/* Right Column: Verified Photography Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-5/4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.heroImage.url}
                alt={hero.heroImage.alt}
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                <p className="text-white text-xs font-medium backdrop-blur-xs px-3 py-1.5 rounded-lg bg-black/40 border border-white/20">
                  {hero.heroImage.credit || 'Real workshop fabrication in Vuyyuru'}
                </p>
              </div>
            </div>

            {/* Decorative Subtle Woodcraft Stamp */}
            <div className="hidden sm:block absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl border border-[#E5DDD1] shadow-lg max-w-[210px]">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-[#6B3F23]">
                Traditional Craft
              </span>
              <span className="block text-xs text-[#5C4D41] mt-0.5">
                Mortise & tenon joinery + modern precision fittings
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
