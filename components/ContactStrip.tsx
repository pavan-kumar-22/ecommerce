import React from 'react';
import Link from 'next/link';
import { Phone, MessageSquare, Clock, MapPin, ArrowRight } from 'lucide-react';
import { PublicContactSettings } from '../types/api';

interface ContactStripProps {
  contact: PublicContactSettings;
}

export const ContactStrip: React.FC<ContactStripProps> = ({ contact }) => {
  const { phone, phoneRaw, whatsapp, address, workingHours } = contact;

  return (
    <section
      className="py-16 sm:py-20 bg-gradient-to-r from-[#2A180E] via-[#3E2312] to-[#2A180E] text-white"
      aria-labelledby="contact-strip-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Heading and message */}
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E5DDD1] block">
              Direct Workshop Communication
            </span>
            <h2
              id="contact-strip-heading"
              className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
            >
              Discuss Your Woodwork Project Directly With Our Master Joiner
            </h2>
            <p className="text-sm text-[#DDD4C4] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Have questions regarding wood species (Burma vs CP Teak), plywood grades (BWP vs
              HDHMR), or scheduling a site survey? We are easily reachable.
            </p>
          </div>

          {/* Right: Verified Action Channels */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-end gap-4">
            {/* 1. Verified WhatsApp Button (Render only if present) */}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
                  'Hello Vuyyuru Carpentry, I would like to inquire about carpentry woodwork.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20BA5A] transition-colors focus-accessible shadow-md"
                id="contact-whatsapp-btn"
                aria-label="Chat with Vuyyuru Carpentry on WhatsApp"
              >
                <MessageSquare className="w-5 h-5" aria-hidden="true" />
                <span>Message on WhatsApp</span>
              </a>
            )}

            {/* 2. Verified Direct Phone Call (Render only if present) */}
            {phone && (
              <a
                href={`tel:${phoneRaw || phone}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-[#3E2312] font-semibold text-sm hover:bg-[#F5EFE6] transition-colors focus-accessible shadow-md"
                id="contact-phone-btn"
                aria-label={`Call Vuyyuru Carpentry directly at ${phone}`}
              >
                <Phone className="w-5 h-5 text-[#6B3F23]" aria-hidden="true" />
                <span>Call {phone}</span>
              </a>
            )}

            {/* 3. Online Visit / Quote Link */}
            <Link
              href="/custom-furniture"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#1E4D2B] text-white font-semibold text-sm hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-md"
            >
              <span>Request Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Operating Hours and Location Strip */}
        <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs text-[#DDD4C4]">
          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-[#C5E3D0] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Workshop Timings</span>
              <span>{workingHours}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#C5E3D0] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block">Workshop Location</span>
              <span>
                {address.line1}, {address.town}, {address.district}, {address.state} —{' '}
                {address.pincode}
              </span>
            </div>
          </div>

          <div className="sm:col-span-2 lg:col-span-1 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#25D366] shrink-0 mt-1.5 animate-pulse" />
            <div>
              <span className="font-semibold text-white block">Appointments & Site Surveys</span>
              <span>Prior booking advised for detailed on-site laser measurements.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
