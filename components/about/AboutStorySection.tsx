'use client';

import React, { useState } from 'react';
import { Hammer, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { AboutWorkshopPhoto } from '@/types/api';

interface AboutStorySectionProps {
  paragraphs: string[];
  teamStatement?: string;
  workshopPhoto?: AboutWorkshopPhoto;
}

export const AboutStorySection: React.FC<AboutStorySectionProps> = ({
  paragraphs,
  teamStatement,
  workshopPhoto,
}) => {
  const [imgError, setImgError] = useState(false);

  // Strictly check publication approval for optional workshop photo
  const shouldRenderPhoto =
    workshopPhoto && workshopPhoto.approvedForPublication === true && !imgError;

  return (
    <section aria-labelledby="story-heading" className="py-12 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Narrative Column */}
        <div className={shouldRenderPhoto ? 'lg:col-span-7' : 'lg:col-span-12 max-w-3xl'}>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-2">
            <Hammer className="w-4 h-4 text-[#2D6A4F]" />
            <span>Our Joinery Story & Background</span>
          </div>

          <h2
            id="story-heading"
            className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] mb-6 leading-snug"
          >
            Handcrafted for Andhra Living, Anchored in Honest Work
          </h2>

          <div className="space-y-4 text-sm sm:text-base text-[#4A3E36] leading-relaxed">
            {paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Realistic Team Statement */}
          {teamStatement && (
            <div className="mt-6 p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD1] flex items-start gap-3">
              <Users className="w-5 h-5 text-[#1E4D2B] shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-1">
                  Artisan Collective
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
                  {teamStatement}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Optional Workshop Photo Column (Hidden gracefully if unapproved or missing) */}
        {shouldRenderPhoto && (
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-2xl border border-[#E5DDD1] p-3 shadow-xs overflow-hidden">
              <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-[#EFE8DC]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={workshopPhoto.url}
                  alt={workshopPhoto.alt || 'Vuyyuru Carpentry active joinery workshop'}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#1E4D2B]/90 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/20 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Workshop Bay</span>
                </div>
              </div>

              {workshopPhoto.caption && (
                <p className="mt-3 text-[11px] text-[#6B5E55] px-2 italic text-center">
                  {workshopPhoto.caption}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
