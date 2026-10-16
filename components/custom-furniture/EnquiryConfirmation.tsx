'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle,
  Copy,
  ExternalLink,
  Phone,
  MessageCircle,
  ArrowRight,
  ShieldAlert,
  Clock,
  Compass,
  FileText,
  CalendarCheck,
} from 'lucide-react';
import { CustomFurnitureEnquiryResponse } from '@/types/api';

interface EnquiryConfirmationProps {
  response: CustomFurnitureEnquiryResponse;
  onReset: () => void;
}

export const EnquiryConfirmation: React.FC<EnquiryConfirmationProps> = ({
  response,
  onReset,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyReference = () => {
    navigator.clipboard.writeText(response.reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Vuyyuru Carpentry, I have submitted a custom furniture enquiry with reference ${response.reference}. Please advise on the next steps.`
  );
  const whatsappUrl = `https://wa.me/918639731477?text=${whatsappMessage}`;

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl mx-auto">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-[#E8F2EC] text-[#2D6A4F] flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle className="w-9 h-9 stroke-[2.2]" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2EC] text-[#2D6A4F] text-xs font-bold uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-pulse" />
          Status: Received
        </div>
        <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#201A15]">
          Your Request Has Been Received!
        </h2>
        <p className="text-sm sm:text-base text-[#5C4D41] max-w-xl mx-auto">
          Thank you for reaching out to Vuyyuru Carpentry. Our master artisan from our Vuyyuru workshop will review your joinery specifications and follow up with you.
        </p>
      </div>

      {/* Reference Code Card */}
      <div className="rounded-2xl border-2 border-[#8B5A2B]/40 bg-[#FAF7F2] p-6 text-center space-y-3 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-widest text-[#8B5A2B]">
          Official Enquiry Reference Number
        </div>
        <div className="flex items-center justify-center gap-3">
          <span
            id="enquiryReferenceCode"
            className="text-2xl sm:text-3xl font-mono font-bold text-[#3E2312] tracking-wider"
          >
            {response.reference}
          </span>
          <button
            type="button"
            onClick={copyReference}
            className="p-2 rounded-lg border border-[#E5DDD1] bg-white hover:bg-[#FAF7F2] text-[#5C4D41] transition-colors cursor-pointer shadow-2xs"
            title="Copy Reference Code"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        {copied && (
          <div className="text-xs font-bold text-[#2D6A4F] animate-fadeIn">
            Reference code copied to clipboard!
          </div>
        )}
        <p className="text-xs text-[#8C7E72]">
          Please save this reference code for future communications or status checks with our workshop.
        </p>
      </div>

      {/* Summary Recap */}
      <div className="rounded-2xl border border-[#E5DDD1] bg-white p-5 space-y-3 text-xs sm:text-sm">
        <h3 className="font-bold text-[#201A15] border-b border-[#E5DDD1] pb-2">
          Submission Summary
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#8C7E72] block">Furniture Item</span>
            <span className="font-semibold text-[#201A15]">{response.summary.furnitureType}</span>
          </div>
          <div>
            <span className="text-[#8C7E72] block">Quantity</span>
            <span className="font-semibold text-[#201A15]">{response.summary.quantity} unit(s)</span>
          </div>
          <div>
            <span className="text-[#8C7E72] block">Locality</span>
            <span className="font-semibold text-[#201A15]">{response.summary.area}</span>
          </div>
          <div>
            <span className="text-[#8C7E72] block">Site Visit</span>
            <span className="font-semibold text-[#201A15] capitalize">
              {response.summary.siteVisitRequested === 'yes' ? 'Requested' : response.summary.siteVisitRequested === 'advise_me' ? 'Advise Me' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Next Steps Workflow */}
      <div className="rounded-2xl border border-[#E5DDD1] bg-white p-6 space-y-4">
        <h3 className="font-serif font-bold text-base sm:text-lg text-[#201A15] flex items-center gap-2">
          <Compass className="w-5 h-5 text-[#8B5A2B]" />
          <span>What Happens Next?</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD1] space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div className="font-bold text-[#201A15]">Artisan Review</div>
            <p className="text-[#5C4D41] text-xs leading-relaxed">
              Our lead carpenter reviews your description, rough sizes, and grain requirements within 24 hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD1] space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div className="font-bold text-[#201A15]">Measurement Call</div>
            <p className="text-[#5C4D41] text-xs leading-relaxed">
              We contact you via your preferred method to verify room layout or schedule an in-person laser survey.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E5DDD1] space-y-2">
            <div className="w-7 h-7 rounded-full bg-[#8B5A2B] text-white flex items-center justify-center font-bold text-xs">
              3
            </div>
            <div className="font-bold text-[#201A15]">Written Quotation</div>
            <p className="text-[#5C4D41] text-xs leading-relaxed">
              You receive a formal itemized quotation with timber species, joinery drawings, and milestone payment schedules.
            </p>
          </div>
        </div>
      </div>

      {/* Business Policy Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#F9F5EF] border border-[#8B5A2B]/20 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#8B5A2B] shrink-0 mt-0.5" />
        <div className="text-xs text-[#5C4D41] leading-relaxed">
          <strong className="font-semibold text-[#201A15]">Important Business Note: </strong>
          This enquiry does not constitute an accepted order, confirmed site visit, or guaranteed final price. Pricing and execution schedules depend on verified site measurements, timber selection (Burma vs CP Teak), and scope approved in a formal written quotation.
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs hover-lift transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat on WhatsApp ({response.reference})</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1 opacity-80" />
        </a>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#E5DDD1] bg-white hover:bg-[#FAF7F2] text-[#5C4D41] font-semibold text-sm cursor-pointer transition-colors"
        >
          Submit Another Request
        </button>

        <Link
          href="/products"
          className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#E5DDD1] bg-white hover:bg-[#FAF7F2] text-[#5C4D41] font-semibold text-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <span>Browse Catalogue</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
