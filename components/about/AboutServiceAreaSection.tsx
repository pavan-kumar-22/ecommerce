'use client';

import React from 'react';
import { MapPin, Navigation, Compass } from 'lucide-react';

interface AboutServiceAreaSectionProps {
  serviceAreaStatement: string;
}

export const AboutServiceAreaSection: React.FC<AboutServiceAreaSectionProps> = ({
  serviceAreaStatement,
}) => {
  return (
    <section aria-labelledby="service-area-heading" className="py-12 sm:py-16 border-t border-[#E5DDD1]">
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-2">
          <MapPin className="w-4 h-4 text-[#2D6A4F]" />
          <span>Regional Reach & Service Area</span>
        </div>
        <h2
          id="service-area-heading"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] mb-3"
        >
          Vuyyuru First, Andhra Wide for Sizable Projects
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
          {serviceAreaStatement}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tier 1 */}
        <div className="bg-white rounded-2xl border border-[#A5D6A7] p-6 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#E8F5E9] rounded-bl-full -mr-6 -mt-6 pointer-events-none" />
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1E4D2B] uppercase tracking-wider mb-2">
            <span>Primary Hub</span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15] mb-2">
            Vuyyuru Town & Mandal
          </h3>
          <p className="text-xs text-[#5C4D41] leading-relaxed mb-4">
            Workshop home base. Rapid site visits for measurements, hardware repairs, door fitting,
            and custom consultations.
          </p>
          <div className="text-[11px] font-semibold text-[#1E4D2B] flex items-center gap-1">
            <Compass className="w-3.5 h-3.5" />
            <span>Complimentary Initial Consult</span>
          </div>
        </div>

        {/* Tier 2 */}
        <div className="bg-white rounded-2xl border border-[#E5DDD1] p-6 shadow-xs">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6B3F23] uppercase tracking-wider mb-2">
            <span>Scheduled Regional Corridor</span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15] mb-2">
            Vijayawada · Guntur · Tenali
          </h3>
          <p className="text-xs text-[#5C4D41] leading-relaxed mb-4">
            Regularly scheduled rounds for modular kitchens, pooja mandirs, solid doors, and made-to-measure dining suites.
          </p>
          <div className="text-[11px] font-semibold text-[#5C4D41] flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Scheduled Advance Booking</span>
          </div>
        </div>

        {/* Tier 3 */}
        <div className="bg-white rounded-2xl border border-[#E5DDD1] p-6 shadow-xs">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider mb-2">
            <span>Extended Project Contracts</span>
          </div>
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15] mb-2">
            Coastal Andhra Residences
          </h3>
          <p className="text-xs text-[#5C4D41] leading-relaxed mb-4">
            Comprehensive full-house carpentry contracts accepted across Krishna, NTR, and Guntur districts subject to workshop lead times.
          </p>
          <div className="text-[11px] font-semibold text-[#5C4D41] flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Contract-Based Logistics</span>
          </div>
        </div>
      </div>
    </section>
  );
};
