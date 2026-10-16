import React from 'react';
import Link from 'next/link';
import { Hammer, MapPin, Phone, MessageSquare, Mail, Shield } from 'lucide-react';
import { SiteSettings } from '../types/api';

interface SiteFooterProps {
  settings: SiteSettings;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ settings }) => {
  const currentYear = 2026;
  const { contact, businessName, tagline } = settings;

  return (
    <footer className="bg-[#1C120B] text-[#D8CEBC] pt-16 pb-24 sm:pb-12 border-t border-[#3E2312]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#3E2312]/70">
          {/* Brand & Purpose (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 text-white focus-accessible">
              <div className="w-9 h-9 rounded-lg bg-[#6B3F23] flex items-center justify-center text-[#FAF7F2]">
                <Hammer className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                {businessName}
              </span>
            </Link>
            <p className="text-xs text-[#B5A998] leading-relaxed max-w-sm">{tagline}</p>
            <p className="text-xs text-[#8C7E72] leading-relaxed">
              Committed to authentic joinery craftsmanship, transparent itemized estimation, and
              long-lasting seasoned solid wood furniture across Andhra Pradesh.
            </p>
          </div>

          {/* Quick Links (Col 5-7) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors py-1 inline-block focus-accessible"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors py-1 inline-block focus-accessible"
                >
                  Furniture & Products
                </Link>
              </li>
              <li>
                <Link
                  href="/custom-furniture"
                  className="hover:text-white transition-colors py-1 inline-block focus-accessible"
                >
                  Custom Quote Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-white transition-colors py-1 inline-block focus-accessible"
                >
                  Carpentry & Polishing Services
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="hover:text-white transition-colors py-1 inline-block focus-accessible"
                >
                  Verified Project Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/account"
                  className="hover:text-white transition-colors py-1 inline-block focus-accessible"
                >
                  Client Account & Job Tracker
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Areas & Categories (Col 8-9) */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Specialties</h3>
            <ul className="space-y-2 text-xs text-[#B5A998]">
              <li>Solid Teakwood Beds & Cots</li>
              <li>Pooja Mandir Wood Carvings</li>
              <li>BWP Modular Kitchens</li>
              <li>Main Entrance Teak Doors</li>
              <li>Custom Fitted Wardrobes</li>
              <li>Repair & Polishing Works</li>
            </ul>
          </div>

          {/* Contact & Workshop Address (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">
              Workshop Contact
            </h3>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5 text-[#B5A998]">
                <MapPin className="w-4 h-4 text-[#8B5A2B] shrink-0 mt-0.5" />
                <span>
                  {contact.address.line1}, {contact.address.town}, {contact.address.district},{' '}
                  {contact.address.state} — {contact.address.pincode}
                </span>
              </li>
              {contact.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#8B5A2B] shrink-0" />
                  <a
                    href={`tel:${contact.phoneRaw || contact.phone}`}
                    className="hover:text-white transition-colors focus-accessible"
                  >
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.whatsapp && (
                <li className="flex items-center gap-2.5">
                  <MessageSquare className="w-4 h-4 text-[#25D366] shrink-0" />
                  <a
                    href={`https://wa.me/${contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors focus-accessible"
                  >
                    WhatsApp Chat Available
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#8B5A2B] shrink-0" />
                  <a
                    href={`mailto:${contact.email}`}
                    className="hover:text-white transition-colors focus-accessible"
                  >
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Privacy & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C7E72]">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <Shield className="w-4 h-4 text-[#6B3F23]" />
            <span>
              &copy; {currentYear} {businessName}. Handcrafted in Vuyyuru, Andhra Pradesh. All rights
              reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/privacy" className="hover:text-[#D8CEBC] transition-colors focus-accessible">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-[#D8CEBC] transition-colors focus-accessible">
              Terms & Quotation Conditions
            </Link>
            <span>•</span>
            <Link href="/about" className="hover:text-[#D8CEBC] transition-colors focus-accessible">
              About Our Artisans
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
