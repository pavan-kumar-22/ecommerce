'use client';

import React from 'react';
import { FileText, Clock, TreePine, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { AboutValue } from '@/types/api';

interface AboutValuesGridProps {
  values: AboutValue[];
}

export const AboutValuesGrid: React.FC<AboutValuesGridProps> = ({ values }) => {
  const renderIcon = (name?: string) => {
    switch (name) {
      case 'FileText':
        return <FileText className="w-5 h-5 text-[#1E4D2B]" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-[#1E4D2B]" />;
      case 'TreePine':
        return <TreePine className="w-5 h-5 text-[#1E4D2B]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#1E4D2B]" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-[#1E4D2B]" />;
    }
  };

  return (
    <section aria-labelledby="values-heading" className="py-12 sm:py-16 border-t border-[#E5DDD1]">
      <div className="max-w-3xl mb-10">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-2">
          <HeartHandshake className="w-4 h-4 text-[#2D6A4F]" />
          <span>Our Operating Principles</span>
        </div>
        <h2
          id="values-heading"
          className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] mb-3"
        >
          Practical Standards, Not Marketing Promises
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
          We believe customer trust is earned through clear specifications, transparent costs, and
          reliable joinery. Here is how we run our workshop every day.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {values.map((val) => (
          <div
            key={val.id}
            id={`value-card-${val.id}`}
            className="bg-white rounded-2xl border border-[#E5DDD1] p-6 sm:p-7 shadow-xs hover-lift transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-center justify-center mb-4">
              {renderIcon(val.iconName)}
            </div>
            <h3 className="font-serif text-base sm:text-lg font-bold text-[#201A15] mb-2">
              {val.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
              {val.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
