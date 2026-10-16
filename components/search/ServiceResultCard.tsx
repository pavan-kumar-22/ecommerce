import React from 'react';
import Link from 'next/link';
import { Hammer, Sofa, DoorClosed, Utensils, Sparkles, Ruler, ArrowRight } from 'lucide-react';
import { ServiceSearchResult } from '../../types/api';

interface ServiceResultCardProps {
  service: ServiceSearchResult;
}

export const ServiceResultCard: React.FC<ServiceResultCardProps> = ({ service }) => {
  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Hammer':
        return <Hammer className="w-5 h-5 text-[#6B3F23]" aria-hidden="true" />;
      case 'Sofa':
        return <Sofa className="w-5 h-5 text-[#6B3F23]" aria-hidden="true" />;
      case 'DoorClosed':
        return <DoorClosed className="w-5 h-5 text-[#6B3F23]" aria-hidden="true" />;
      case 'Utensils':
        return <Utensils className="w-5 h-5 text-[#6B3F23]" aria-hidden="true" />;
      case 'Ruler':
        return <Ruler className="w-5 h-5 text-[#6B3F23]" aria-hidden="true" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-[#6B3F23]" aria-hidden="true" />;
    }
  };

  return (
    <article
      className="group bg-white rounded-2xl border border-[#E5DDD1] p-5 hover-lift flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs focus-within:ring-2 focus-within:ring-[#2D6A4F]"
      data-testid={`service-card-${service.id}`}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#F5EFE6] group-hover:bg-[#E8F2EC] flex items-center justify-center transition-colors shrink-0 mt-0.5">
          {getIcon(service.iconName)}
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E4D2B] bg-[#E8F2EC] px-2 py-0.5 rounded-full inline-block mb-1.5">
            Service
          </span>
          <h3 className="text-base font-semibold text-[#201A15] group-hover:text-[#1E4D2B] transition-colors">
            <Link href={service.route} className="focus:outline-none focus:underline">
              {service.title}
            </Link>
          </h3>
          <p className="text-xs text-[#5C4D41] mt-1 leading-relaxed max-w-2xl">
            {service.summary}
          </p>
        </div>
      </div>

      <Link
        href={service.route}
        className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] border border-[#E5DDD1] text-[#3E2312] hover:bg-[#EFE8DC] transition-colors focus-accessible group/btn"
      >
        <span>Enquire</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
      </Link>
    </article>
  );
};
