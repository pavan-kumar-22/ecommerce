'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  FileText,
  Printer,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
} from 'lucide-react';
import { GeneralEnquiryResponse } from '@/types/api';

interface ContactConfirmationProps {
  response: GeneralEnquiryResponse;
  onReset: () => void;
}

export const ContactConfirmation: React.FC<ContactConfirmationProps> = ({
  response,
  onReset,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      data-testid="contact-confirmation-panel"
      className="bg-white rounded-3xl border border-[#A5D6A7] p-6 sm:p-10 shadow-md space-y-8 animate-fade-in"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#E5DDD1]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#E8F5E9] border border-[#81C784] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-7 h-7 text-[#2E7D32]" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E4D2B] block">
              Enquiry Acknowledged
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15]">
              Thank You! We Have Received Your Request
            </h2>
          </div>
        </div>

        {/* Reference Pill */}
        <div className="bg-[#FAF7F2] border border-[#D9CFC4] px-4 py-2 rounded-xl text-left sm:text-right">
          <span className="text-[10px] font-bold text-[#8C7A6B] block uppercase tracking-wider">
            Authoritative Reference
          </span>
          <span className="font-mono text-base font-bold text-[#1E4D2B]">
            {response.reference}
          </span>
        </div>
      </div>

      {/* Itemized Summary Card */}
      <div className="bg-[#FAF7F2] rounded-2xl border border-[#E5DDD1] p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B3F23]">
          Submitted Request Summary
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-[#8C7A6B] block mb-0.5">Selected Service</span>
            <span className="font-bold text-[#201A15]">{response.summary.serviceName}</span>
          </div>

          <div>
            <span className="text-[#8C7A6B] block mb-0.5">Area / Locality</span>
            <span className="font-bold text-[#201A15]">{response.summary.area}</span>
          </div>

          <div>
            <span className="text-[#8C7A6B] block mb-0.5">Timeline Urgency</span>
            <span className="font-bold text-[#201A15] capitalize">
              {response.summary.urgency.replace('_', ' ')}
            </span>
          </div>

          <div>
            <span className="text-[#8C7A6B] block mb-0.5">Site Visit Requested</span>
            <span className="font-bold text-[#201A15] capitalize">
              {response.summary.siteVisitRequested === 'yes'
                ? 'Yes, on-site visit requested'
                : response.summary.siteVisitRequested === 'no'
                ? 'No, remote consultation'
                : 'Advise on feasibility'}
            </span>
          </div>

          <div>
            <span className="text-[#8C7A6B] block mb-0.5">Preferred Contact Method</span>
            <span className="font-bold text-[#201A15] capitalize">
              {response.summary.preferredContactMethod}
            </span>
          </div>

          {response.summary.preferredDate && (
            <div>
              <span className="text-[#8C7A6B] block mb-0.5">Preferred Date & Window</span>
              <span className="font-bold text-[#201A15]">
                {response.summary.preferredDate} (
                {response.summary.preferredTimeWindow || 'Morning'})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Business Rule Warning Box */}
      <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-2xl p-5 sm:p-6 flex items-start gap-4 text-xs sm:text-sm text-[#14532D] leading-relaxed">
        <ShieldCheck className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block mb-1">
            Official Workflow & Scheduling Notice:
          </span>
          {response.summary.consultationNotice}
          <span className="block mt-1.5 text-[11px] text-[#166534]">
            An artisan from our Vuyyuru joinery workshop will inspect your location, assess scope feasibility, and contact you via your preferred channel before scheduling work or preparing a formal written quotation.
          </span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E5DDD1]">
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C4D41] hover:text-[#201A15] focus-accessible p-1 rounded-md"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save Copy</span>
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-[#D9CFC4] bg-white text-[#201A15] hover:bg-[#FAF7F2] transition-colors focus-accessible shadow-xs"
          >
            Submit Another Request
          </button>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#1E4D2B] text-white hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
