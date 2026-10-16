'use client';

import React from 'react';
import { GitCommit, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { AboutProcessStep } from '@/types/api';

interface AboutProcessSectionProps {
  steps: AboutProcessStep[];
}

export const AboutProcessSection: React.FC<AboutProcessSectionProps> = ({ steps }) => {
  return (
    <section
      aria-labelledby="process-heading"
      className="py-12 sm:py-16 border-t border-[#E5DDD1] bg-[#FAF7F2] -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 rounded-3xl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-2">
            <GitCommit className="w-4 h-4 text-[#2D6A4F]" />
            <span>Honest Craftsmanship Process</span>
          </div>
          <h2
            id="process-heading"
            className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] mb-3"
          >
            How We Work With You
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
            From your first message to the final hand-rubbed coat, here is the transparent path to
            getting custom woodwork crafted for your home.
          </p>
        </div>

        {/* Process Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 mb-10">
          {steps.map((st) => (
            <div
              key={st.step}
              className="bg-white rounded-2xl border border-[#E5DDD1] p-5 flex flex-col justify-between shadow-2xs relative"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-[#1E4D2B] text-white text-xs font-bold flex items-center justify-center mb-3">
                  0{st.step}
                </div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#201A15] mb-1.5">
                  {st.title}
                </h3>
                <p className="text-xs text-[#5C4D41] leading-relaxed">
                  {st.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mandatory Workflow Disclaimer Notice */}
        <div className="bg-white rounded-2xl border border-[#F59E0B]/30 p-5 sm:p-6 flex items-start gap-4 shadow-xs">
          <ShieldAlert className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed">
            <span className="font-bold text-[#201A15] block mb-1">
              Important Ordering & Quotation Policy:
            </span>
            Submitting an inquiry or requesting a site visit does not automatically mean a job is
            accepted or scheduled. Complex custom furniture, modular kitchens, wardrobes, and major
            doors require laser measurements, timber species selection, and a formalized written
            quotation with customer approval before joinery begins.
          </div>
        </div>
      </div>
    </section>
  );
};
