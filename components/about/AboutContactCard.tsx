'use client';

import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, MapPin, Clock, Sparkles } from 'lucide-react';

interface AboutContactCardProps {
  contactSummary: {
    phone: string;
    whatsapp: string;
    workshopAddress: string;
    consultationHours: string;
  };
}

export const AboutContactCard: React.FC<AboutContactCardProps> = ({ contactSummary }) => {
  const whatsappUrl = `https://wa.me/${contactSummary.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
    'Namaste Vuyyuru Carpentry, I would like to consult with you about custom carpentry work.'
  )}`;

  return (
    <section aria-labelledby="contact-summary-heading" className="py-12 sm:py-16 border-t border-[#E5DDD1]">
      <div className="bg-[#1E4D2B] text-white rounded-3xl p-8 sm:p-12 shadow-lg border border-[#2D6A4F] relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#A5D6A7]" />
              <span>Direct Master-Artisan Contact</span>
            </div>

            <h2
              id="contact-summary-heading"
              className="font-serif text-2xl sm:text-3xl font-bold mb-3"
            >
              Have a Carpentry Project in Mind?
            </h2>

            <p className="text-xs sm:text-sm text-white/80 leading-relaxed mb-6 max-w-xl">
              Tell us what you want to build or repair. We will review your requirements, advise on
              feasible options and timber choices, and arrange a site visit where needed.
            </p>

            <div className="space-y-3 text-xs sm:text-sm text-white/90">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#A5D6A7] shrink-0 mt-0.5" />
                <span>{contactSummary.workshopAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#A5D6A7] shrink-0" />
                <span>{contactSummary.consultationHours}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
            <a
              href={`tel:${contactSummary.phone}`}
              id="about-call-btn"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#1E4D2B] hover:bg-[#FAF7F2] font-bold text-sm py-3 px-5 rounded-xl transition-colors focus-accessible shadow-xs text-center"
            >
              <Phone className="w-4 h-4" />
              <span>Call: {contactSummary.phone}</span>
            </a>

            <a
              href={whatsappUrl}
              id="about-whatsapp-btn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm py-3 px-5 rounded-xl transition-colors focus-accessible shadow-xs text-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              href="/custom-furniture"
              id="about-request-btn"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm py-3 px-5 rounded-xl border border-white/20 transition-colors focus-accessible text-center"
            >
              <span>Submit Project Requirements Online</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
