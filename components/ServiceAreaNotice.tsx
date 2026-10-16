import React from 'react';
import { MapPin, AlertCircle, Compass } from 'lucide-react';

interface ServiceAreaNoticeProps {
  summary?: string;
}

export const ServiceAreaNotice: React.FC<ServiceAreaNoticeProps> = ({ summary }) => {
  return (
    <section
      className="py-12 bg-[#FAF7F2] border-b border-[#E5DDD1]"
      aria-labelledby="service-area-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] rounded-2xl border border-[#E5DDD1] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E8F2EC] text-[#1E4D2B] flex items-center justify-center shrink-0 mt-0.5">
              <Compass className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-4 h-4 text-[#2D6A4F]" />
                <h2 id="service-area-heading" className="text-base font-bold text-[#201A15]">
                  Local Service Area & Site Visit Feasibility
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#5C4D41] max-w-2xl leading-relaxed">
                {summary ||
                  'Headquartered with our active joinery workshop in Vuyyuru town. We prioritize direct services in Vuyyuru, Vijayawada, Guntur, Mangalagiri, and adjacent Krishna & NTR district locations. Outstation projects are accepted only subject to master-artisan scheduling and travel logistics.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 bg-[#F5EFE6] px-4 py-2.5 rounded-xl border border-[#E5DDD1] flex items-center gap-2 text-xs font-semibold text-[#6B3F23]">
            <AlertCircle className="w-4 h-4 text-[#8B5A2B]" />
            <span>Honest Local Craftsmanship — No False Claims</span>
          </div>
        </div>
      </div>
    </section>
  );
};
