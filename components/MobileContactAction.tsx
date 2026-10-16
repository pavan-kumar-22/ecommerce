import React from 'react';
import { Phone, MessageSquare, FileText } from 'lucide-react';
import Link from 'next/link';
import { PublicContactSettings } from '../types/api';

interface MobileContactActionProps {
  contact: PublicContactSettings;
}

export const MobileContactAction: React.FC<MobileContactActionProps> = ({ contact }) => {
  const { phone, phoneRaw, whatsapp } = contact;

  // If neither phone nor WhatsApp is configured, do not render floating action
  if (!phone && !whatsapp) {
    return null;
  }

  return (
    <aside
      className="fixed bottom-0 inset-x-0 z-30 sm:hidden bg-white/95 backdrop-blur-md border-t border-[#E5DDD1] px-4 py-2.5 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]"
      aria-label="Direct mobile contact options"
    >
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* WhatsApp Quick Action */}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(
              'Hi Vuyyuru Carpentry, I would like to enquire about furniture work.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-semibold hover:bg-[#20BA5A] transition-colors focus-accessible shadow-xs"
            id="mobile-contact-whatsapp"
            aria-label="Chat on WhatsApp"
          >
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        )}

        {/* Direct Phone Call Quick Action */}
        {phone && (
          <a
            href={`tel:${phoneRaw || phone}`}
            className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#FAF7F2] text-[#3E2312] border border-[#E5DDD1] text-xs font-semibold hover:bg-[#EFE8DC] transition-colors focus-accessible shadow-xs"
            id="mobile-contact-phone"
            aria-label={`Call ${phone}`}
          >
            <Phone className="w-4 h-4 text-[#6B3F23]" aria-hidden="true" />
            <span>Call Now</span>
          </a>
        )}

        {/* Custom Quote Quick Action */}
        <Link
          href="/custom-furniture"
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#1E4D2B] text-white text-xs font-semibold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs"
          id="mobile-contact-quote"
        >
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>Quote</span>
        </Link>
      </div>
    </aside>
  );
};
