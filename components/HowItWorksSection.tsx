import React from 'react';
import Link from 'next/link';
import { ClipboardList, Ruler, FileCheck, CheckCircle2, Truck, ArrowRight } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Share Requirements',
      description:
        'Submit a request online or message us your room dimensions, furniture preferences, and wood type.',
      icon: ClipboardList,
    },
    {
      number: '02',
      title: 'On-Site Measurements',
      description:
        'Our measurement supervisor visits your site in Vuyyuru or nearby regions with laser tools to verify wall squareness and floor levels.',
      icon: Ruler,
    },
    {
      number: '03',
      title: 'Itemized Written Quote',
      description:
        'You receive a clear proposal separating timber CFT, plywood, hardware brands (Hettich/Ebco), labor, and polish costs.',
      icon: FileCheck,
    },
    {
      number: '04',
      title: 'Contract Approval & Booking',
      description:
        'Approve the quote and place the standard Milestone 1 booking deposit. Material procurement starts immediately.',
      icon: CheckCircle2,
    },
    {
      number: '05',
      title: 'Phased Fabrication & Handover',
      description:
        'Track workshop progress, inspect carcass joinery, and settle remaining milestones upon final snag clearance and delivery.',
      icon: Truck,
    },
  ];

  return (
    <section
      className="py-16 sm:py-24 bg-[#F5EFE6] border-b border-[#E5DDD1]"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#1E4D2B] block mb-2">
            Transparent Workflow
          </span>
          <h2
            id="how-it-works-heading"
            className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15] mb-4"
          >
            How Custom Carpentry Works With Us
          </h2>
          <p className="text-sm sm:text-base text-[#5C4D41]">
            No surprise add-ons or hidden charges. Every project follows a disciplined 5-stage
            milestone process from raw timber selection to final handover.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white p-6 rounded-2xl border border-[#E5DDD1] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-[#8B5A2B]/40">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] text-[#1E4D2B] flex items-center justify-center">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-[#201A15] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#5C4D41] leading-relaxed">{step.description}</p>
                </div>

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#FAF7F2] border border-[#E5DDD1] text-[#8C7E72] flex items-center justify-center text-[10px]">
                    &rarr;
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Custom Quote Callout */}
        <div className="mt-12 text-center">
          <Link
            href="/custom-furniture"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E4D2B] text-white text-sm font-semibold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-sm"
          >
            <span>Start your custom furniture request</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
