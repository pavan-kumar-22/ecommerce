'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Hammer,
  Sofa,
  DoorClosed,
  Utensils,
  Sparkles,
  Store,
  Ruler,
  Check,
  AlertTriangle,
  Clock,
  ArrowRight,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { PublicService } from '@/types/api';

interface ServiceCardProps {
  service: PublicService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const [showFullScope, setShowFullScope] = useState(false);

  // Map icon name to Lucide icon component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Hammer':
        return Hammer;
      case 'Sofa':
        return Sofa;
      case 'DoorClosed':
        return DoorClosed;
      case 'Utensils':
        return Utensils;
      case 'Sparkles':
        return Sparkles;
      case 'Store':
        return Store;
      case 'Ruler':
        return Ruler;
      default:
        return Hammer;
    }
  };

  const IconComponent = getIcon(service.iconName);

  // Format paise to INR
  const formatRupees = (paise?: number) => {
    if (paise === undefined) return '';
    return `₹${(paise / 100).toLocaleString('en-IN')}`;
  };

  // Determine target route
  // For custom furniture, link directly to custom furniture designer; for others, link to /contact?service=slug
  const targetCtaUrl =
    service.category === 'custom_furniture'
      ? '/custom-furniture'
      : `/contact?service=${encodeURIComponent(service.slug)}`;

  return (
    <article
      id={`service-${service.slug}`}
      className="bg-white rounded-3xl border border-[#E5DDD1] overflow-hidden shadow-xs hover-lift flex flex-col transition-all duration-300"
    >
      {/* Top Image & Badge */}
      <div className="relative h-52 w-full bg-[#FAF7F2] overflow-hidden">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#F3ECE2] text-[#8B5A2B]">
            <IconComponent className="w-16 h-16 opacity-40" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#3E2312] text-xs font-bold shadow-xs flex items-center gap-1.5">
            <IconComponent className="w-3.5 h-3.5 text-[#8B5A2B]" />
            <span>{service.categoryName}</span>
          </span>
        </div>

        {/* Pricing Mode Badge */}
        <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              service.pricingMode === 'indicative'
                ? 'bg-[#8B5A2B] text-white'
                : service.pricingMode === 'fixed'
                ? 'bg-[#2D6A4F] text-white'
                : 'bg-[#201A15]/90 text-[#F3ECE2] border border-white/20'
            }`}
          >
            {service.pricingMode === 'indicative'
              ? 'Indicative Estimate'
              : service.pricingMode === 'fixed'
              ? 'Fixed Price'
              : 'Laser Inspection & Quote Required'}
          </span>

          {service.leadTimeEstimate && (
            <span className="text-[11px] font-medium bg-black/50 px-2 py-0.5 rounded-md flex items-center gap-1 text-white/90">
              <Clock className="w-3 h-3 text-amber-300" />
              <span>{service.leadTimeEstimate.split(' ')[0]} {service.leadTimeEstimate.split(' ')[1]}</span>
            </span>
          )}
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h3 className="text-xl font-serif font-bold text-[#201A15] leading-snug">
            {service.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
            {service.summary}
          </p>

          {/* Pricing Highlight Banner */}
          {service.pricingMode === 'indicative' && service.indicativeMinPaise && service.indicativeMaxPaise && (
            <div className="p-3 rounded-xl bg-[#F9F5EF] border border-[#8B5A2B]/20 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-[#8B5A2B] uppercase tracking-wider">
                  Typical Labour & Survey Range:
                </span>
                <span className="text-sm font-bold text-[#3E2312]">
                  {formatRupees(service.indicativeMinPaise)} – {formatRupees(service.indicativeMaxPaise)}
                  {service.category === 'finishing' ? ' / sq.ft' : ''}
                </span>
              </div>
              <p className="text-[11px] text-[#8C7E72] flex items-center gap-1">
                <Info className="w-3 h-3 text-[#8B5A2B] shrink-0" />
                <span>Indicative estimate; hardware, timber, and travel affect final quotation.</span>
              </p>
            </div>
          )}

          {service.pricingMode === 'inspection_required' && (
            <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E5DDD1] text-[11px] text-[#5C4D41] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <span>Itemized quote prepared after on-site laser measurements and wood selection.</span>
            </div>
          )}

          {/* Scope Notes */}
          <div className="space-y-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7E72] block">
              What This Service Covers:
            </span>
            <ul className="space-y-1.5 text-xs text-[#201A15]">
              {(showFullScope ? service.scopeNotes : service.scopeNotes.slice(0, 3)).map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5 stroke-[2.5]" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>

            {service.scopeNotes.length > 3 && (
              <button
                type="button"
                onClick={() => setShowFullScope(!showFullScope)}
                className="text-xs font-bold text-[#8B5A2B] hover:text-[#6B3F23] flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>{showFullScope ? 'Show less scope' : `+${service.scopeNotes.length - 3} more scope details`}</span>
                {showFullScope ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {/* Exclusions */}
          {service.exclusions && service.exclusions.length > 0 && showFullScope && (
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1.5 animate-fadeIn">
              <span className="text-[11px] font-bold text-[#8B5A2B] flex items-center gap-1 uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3 text-amber-600" />
                <span>Scope Exclusions:</span>
              </span>
              <ul className="space-y-1 text-[11px] text-[#5C4D41]">
                {service.exclusions.map((ex, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Card CTA */}
        <div className="pt-4 border-t border-[#E5DDD1] flex items-center justify-between gap-3">
          <div className="text-[11px] text-[#8C7E72]">
            <span>{service.typicalDuration || 'Tailored to site scope'}</span>
          </div>

          <Link
            href={targetCtaUrl}
            className="px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D2B] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs hover-lift transition-all focus-accessible"
            aria-label={`Request ${service.name}`}
          >
            <span>Request this service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
