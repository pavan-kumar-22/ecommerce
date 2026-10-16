'use client';

import React from 'react';
import {
  ClipboardList,
  Compass,
  Ruler,
  FileCheck,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const STEPS = [
  {
    step: 1,
    title: 'Share Details',
    desc: 'Describe your requirement, room type, or furniture photos via our online form or direct WhatsApp consultation.',
    icon: ClipboardList,
  },
  {
    step: 2,
    title: 'Artisan Review',
    desc: 'Our lead carpenter analyzes joinery complexity, hardware feasibility, and timber requirements within 24 hours.',
    icon: Compass,
  },
  {
    step: 3,
    title: 'Laser Site Survey',
    desc: 'We visit your property in Vuyyuru, Vijayawada, or Guntur with precision laser meters to verify wall plumb and floor levels.',
    icon: Ruler,
  },
  {
    step: 4,
    title: 'Written Quotation',
    desc: 'You receive an itemized quote detailing timber grades (Burma/CP Teak), hardware brands (Blum/Ebco), and payment milestones.',
    icon: FileCheck,
  },
  {
    step: 5,
    title: 'Workshop Joinery',
    desc: 'Joinery begins at our Vuyyuru workshop after a 50% timber advance, with customer grain inspection before cutting.',
    icon: CheckCircle2,
  },
];

export const ServiceProcessSection: React.FC = () => {
  return (
    <section className="bg-white rounded-3xl border border-[#E5DDD1] p-6 sm:p-10 shadow-xs space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2EC] text-[#2D6A4F] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent 5-Stage Craftsmanship</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#201A15]">
          How Our Carpentry Process Works
        </h2>
        <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
          From minor repairs to architectural woodwork, every project follows a structured, traceable workflow ensuring zero surprise costs and true seasoned timber quality.
        </p>
      </div>

      {/* Process Step Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD1] flex flex-col justify-between space-y-3 relative group hover:border-[#8B5A2B]/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {s.step}
                </div>
                <Icon className="w-5 h-5 text-[#8B5A2B] opacity-70" />
              </div>

              <div className="space-y-1.5 pt-2">
                <h3 className="font-bold text-sm text-[#201A15]">{s.title}</h3>
                <p className="text-xs text-[#5C4D41] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Process Footer Policy Banner */}
      <div className="p-4 rounded-xl bg-[#F9F5EF] border border-[#8B5A2B]/20 text-xs text-[#5C4D41] text-center leading-relaxed">
        <strong className="font-bold text-[#201A15]">Commitment to Realistic Commitments: </strong>
        We never promise instant automated price guarantees for complex bespoke joinery. Written quotations, verified measurements, and timber grain inspections protect your home investment.
      </div>
    </section>
  );
};
