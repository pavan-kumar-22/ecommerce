'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShieldAlert } from 'lucide-react';
import { ServiceFaq } from '@/types/api';

interface ServiceFaqSectionProps {
  faqs: ServiceFaq[];
}

export const ServiceFaqSection: React.FC<ServiceFaqSectionProps> = ({ faqs }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-white rounded-3xl border border-[#E5DDD1] p-6 sm:p-10 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DDD1] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8B5A2B] mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Customer Guidance & Policies</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#201A15]">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-[#5C4D41] mt-1">
            Clear, approved answers regarding measurements, timber inspection, site visit fees, and quotation policies.
          </p>
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`rounded-2xl border transition-all ${
                isOpen
                  ? 'border-[#8B5A2B] bg-[#FAF7F2]'
                  : 'border-[#E5DDD1] bg-white hover:border-[#8B5A2B]/40'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleFaq(faq.id)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${faq.id}`}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus-accessible rounded-2xl"
              >
                <span className="font-bold text-sm sm:text-base text-[#201A15]">
                  {faq.question}
                </span>
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isOpen ? 'bg-[#8B5A2B] text-white' : 'bg-[#F3ECE2] text-[#5C4D41]'
                  }`}
                >
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </button>

              {isOpen && (
                <div
                  id={`faq-answer-${faq.id}`}
                  className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#5C4D41] leading-relaxed border-t border-[#E5DDD1]/60 pt-3 animate-fadeIn"
                >
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Scope Changes Note */}
      <div className="p-4 rounded-xl bg-[#F9F5EF] border border-[#8B5A2B]/20 flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-[#8B5A2B] shrink-0 mt-0.5" />
        <p className="text-xs text-[#5C4D41] leading-relaxed">
          <strong className="font-semibold text-[#201A15]">Scope Integrity: </strong>
          In accordance with our business documentation, written approval is mandatory for any scope modifications during production. All material upgrades and hardware variations maintain traceable costs.
        </p>
      </div>
    </section>
  );
};
