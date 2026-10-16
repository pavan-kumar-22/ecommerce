'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, User, Menu, X, Hammer, Phone, ShoppingBag } from 'lucide-react';
import { SiteSettings } from '../types/api';

interface SiteHeaderProps {
  settings: SiteSettings;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ settings }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchExpandedMobile, setIsSearchExpandedMobile] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpandedMobile(false);
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Services', href: '/services' },
    { label: 'Projects', href: '/projects' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E5DDD1] transition-all">
      {/* 1. Optional Public Announcement Bar */}
      {settings.announcement?.enabled && settings.announcement.text && (
        <div className="bg-[#1E4D2B] text-white text-xs font-medium py-2 px-4 text-center tracking-wide">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span>{settings.announcement.text}</span>
            {settings.announcement.linkUrl && (
              <Link
                href={settings.announcement.linkUrl}
                className="underline underline-offset-2 hover:text-[#C5E3D0] focus-accessible transition-colors font-semibold"
              >
                Learn more &rarr;
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Business Name */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus-accessible rounded-lg p-1"
            aria-label={`${settings.businessName} Home`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#3E2312] flex items-center justify-center text-[#FAF7F2] shadow-xs group-hover:bg-[#6B3F23] transition-colors">
              <Hammer className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#201A15] group-hover:text-[#6B3F23] transition-colors leading-none">
                {settings.businessName}
              </span>
              <span className="block text-[11px] font-medium tracking-wider uppercase text-[#6B3F23] mt-1">
                Woodcraft · Vuyyuru
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md relative mx-4"
          >
            <label htmlFor="desktop-search-input" className="sr-only">
              Search furniture, doors, kitchens, and services
            </label>
            <input
              id="desktop-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-[#FFFFFF] border border-[#E5DDD1] rounded-full pl-10 pr-4 py-2 text-sm text-[#201A15] placeholder-[#8C7E72] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 focus:outline-none transition-all shadow-xs"
            />
            <Search
              className="w-4 h-4 text-[#8C7E72] absolute left-3.5 pointer-events-none"
              aria-hidden="true"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#5C4D41] hover:text-[#1E4D2B] transition-colors py-1 focus-accessible rounded-md"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Icons (Account + Mobile Search Trigger + Mobile Menu Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Phone Call Button (desktop) */}
            {settings.contact.phone && (
              <a
                href={`tel:${settings.contact.phoneRaw || settings.contact.phone}`}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#D5E5DA] bg-[#E8F2EC] text-[#1E4D2B] text-xs font-semibold hover:bg-[#D5E5DA] transition-colors focus-accessible"
                aria-label={`Call Vuyyuru Carpentry at ${settings.contact.phone}`}
              >
                <Phone className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span className="hidden xl:inline">{settings.contact.phone}</span>
                <span className="xl:hidden">Call</span>
              </a>
            )}

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchExpandedMobile(!isSearchExpandedMobile)}
              className="md:hidden p-2 text-[#5C4D41] hover:text-[#201A15] hover:bg-[#EFE8DC] rounded-lg focus-accessible"
              aria-label="Toggle search form"
              aria-expanded={isSearchExpandedMobile}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Customer Account Entry Point */}
            <Link
              href="/account"
              className="p-2 text-[#5C4D41] hover:text-[#1E4D2B] hover:bg-[#EFE8DC] rounded-lg transition-colors focus-accessible flex items-center gap-1.5"
              aria-label="Customer Account and Quotations"
              id="header-account-link"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-medium">Account</span>
            </Link>

            {/* Shopping Cart Entry Point */}
            <Link
              href="/cart"
              className="p-2 text-[#5C4D41] hover:text-[#1E4D2B] hover:bg-[#EFE8DC] rounded-lg transition-colors focus-accessible flex items-center gap-1.5"
              aria-label="Shopping Cart"
              id="header-cart-link"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-medium">Cart</span>
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#5C4D41] hover:text-[#201A15] hover:bg-[#EFE8DC] rounded-lg focus-accessible"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable Drawer */}
        {isSearchExpandedMobile && (
          <div className="md:hidden py-3 border-t border-[#E5DDD1] animate-in fade-in duration-200">
            <form onSubmit={handleSearchSubmit} role="search" className="relative">
              <label htmlFor="mobile-search-input" className="sr-only">
                Search
              </label>
              <input
                id="mobile-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What are you looking for?"
                autoFocus
                className="w-full bg-[#FFFFFF] border border-[#E5DDD1] rounded-full pl-10 pr-4 py-2.5 text-sm text-[#201A15] placeholder-[#8C7E72] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#8C7E72] absolute left-3.5 top-3.5 pointer-events-none" />
            </form>
          </div>
        )}
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden border-t border-[#E5DDD1] bg-[#FAF7F2] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-[#201A15] hover:bg-[#EFE8DC] hover:text-[#1E4D2B] transition-colors focus-accessible"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#E5DDD1] flex flex-col gap-2.5">
            <Link
              href="/custom-furniture"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#1E4D2B] text-white hover:bg-[#2D6A4F] transition-colors shadow-xs"
            >
              Request a custom quote
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#EFE8DC] text-[#3E2312] hover:bg-[#E5DDD1] transition-colors"
            >
              Browse products
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
