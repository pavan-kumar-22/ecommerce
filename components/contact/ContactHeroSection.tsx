'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Phone, MessageCircle, MapPin, ShieldCheck, Clock } from 'lucide-react';

export const ContactHeroSection: React.FC = () => {
  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumbs"
        className="bg-[#F5EFEB] border-b border-[#E5DDD1] py-3 text-xs text-[#6B5E55]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2">
            <li>
              <Link
                href="/"
                className="hover:text-[#1E4D2B] transition-colors flex items-center gap-1 focus-accessible rounded-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-[#A89A8E]" />
            <li aria-current="page" className="font-semibold text-[#201A15]">
              Contact & Site Visit
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="relative bg-[#201A15] text-[#FAF7F2] py-12 sm:py-16 overflow-hidden border-b border-[#3E2312]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,106,79,0.22),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#1E4D2B]/80 text-[#FAF7F2] text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-[#2D6A4F]/60">
              <ShieldCheck className="w-4 h-4 text-[#A5D6A7]" />
              <span>Direct Master-Artisan Review · Vuyyuru Workshop</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Tell Us About Your Carpentry Work
            </h1>

            <p className="text-sm sm:text-base text-[#D9CFC4] leading-relaxed mb-6">
              Share your requirements and preferred way for our team to contact you. Whether you need
              a hinge or lock repair, made-to-measure doors, wardrobes, or a complete modular kitchen,
              we will evaluate your scope, verify site dimensions, and provide an honest written quotation.
            </p>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <a
                href="tel:+919440281734"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-[#FAF7F2] px-3.5 py-2 rounded-xl border border-white/20 transition-all focus-accessible"
              >
                <Phone className="w-3.5 h-3.5 text-[#A5D6A7]" />
                <span>Call: +91 94402 81734</span>
              </a>

              <a
                href="https://wa.me/919440281734?text=Namaste%20Vuyyuru%20Carpentry,%20I%20would%20like%20to%20consult%20about%20a%20carpentry%20service."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#FAF7F2] px-3.5 py-2 rounded-xl border border-[#25D366]/40 transition-all focus-accessible"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp Consultation</span>
              </a>

              <div className="hidden sm:inline-flex items-center gap-1.5 text-[#D9CFC4] bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
                <span>Vuyyuru Workshop Base</span>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};
