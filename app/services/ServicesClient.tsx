'use client';

import React, { useState, useEffect, useTransition } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Home,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Shield,
  RefreshCw,
} from 'lucide-react';

import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { MobileContactAction } from '@/components/MobileContactAction';
import { ServiceCard } from '@/components/services/ServiceCard';
import { ServiceProcessSection } from '@/components/services/ServiceProcessSection';
import { ServiceFaqSection } from '@/components/services/ServiceFaqSection';
import { ServicesFilterTabs } from '@/components/services/ServicesFilterTabs';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

import { PublicService, ServiceFaq, SiteSettings } from '@/types/api';
import { getPublicServices, getPublicServiceFaqs, getSiteSettings } from '@/lib/api-client';
import { verifiedSiteSettings } from '@/lib/public-data';

export function ServicesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const categoryParam = searchParams.get('category') || 'all';

  const [settings, setSettings] = useState<SiteSettings>(verifiedSiteSettings);
  const [services, setServices] = useState<PublicService[]>([]);
  const [faqs, setFaqs] = useState<ServiceFaq[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load services and FAQs
  const loadData = async (cat: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [settingsRes, servicesRes, faqsRes] = await Promise.all([
        getSiteSettings(),
        getPublicServices(cat),
        getPublicServiceFaqs(),
      ]);

      setSettings(settingsRes.data);
      // Strictly filter to active services on client as well to guarantee no drafts leak
      setServices(servicesRes.data.filter((s) => s.status === 'active'));
      setFaqs(faqsRes.data);
    } catch (err: any) {
      console.error('Failed to load services:', err);
      setErrorMessage(
        err.message || 'Unable to retrieve carpentry services. Please check your network and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeCategory);
  }, [activeCategory]);

  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    startTransition(() => {
      const params = new URLSearchParams(window.location.search);
      if (catId === 'all') {
        params.delete('category');
      } else {
        params.set('category', catId);
      }
      const qs = params.toString();
      router.push(`/services${qs ? `?${qs}` : ''}`, { scroll: false });
    });
  };

  // Derive counts per category from all active services
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { all: services.length };
    services.forEach((s) => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [services]);

  // Filtered services for display
  const displayedServices = React.useMemo(() => {
    if (activeCategory === 'all') return services;
    return services.filter((s) => s.category === activeCategory);
  }, [services, activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Global Header */}
      <SiteHeader settings={settings} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center text-xs text-[#5C4D41]">
          <Link href="/" className="hover:text-[#8B5A2B] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-[#8C7E72]" />
          <span className="font-semibold text-[#201A15]" aria-current="page">
            Carpentry Services
          </span>
        </nav>

        {/* Hero Section */}
        <section className="space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2EC] text-[#2D6A4F] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Carpentry Services · Vuyyuru Workshop</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#201A15] tracking-tight">
            From Minor Repairs to Architectural Woodwork
          </h1>

          <p className="text-sm sm:text-base text-[#5C4D41] max-w-3xl leading-relaxed">
            Describe what you need. Our master artisans in Vuyyuru review your project scope, provide transparent indicative estimates where applicable, and arrange precision laser site surveys across coastal Andhra Pradesh.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D2B] text-white font-bold text-sm shadow-xs hover-lift transition-all focus-accessible"
            >
              Request a Service Consultation
            </Link>

            <Link
              href="/custom-furniture"
              className="px-6 py-3 rounded-xl border border-[#E5DDD1] bg-white hover:bg-[#FAF7F2] text-[#3E2312] font-semibold text-sm transition-colors focus-accessible"
            >
              Custom Furniture Designer
            </Link>
          </div>
        </section>

        {/* Urgent Service & Capacity Callout Banner */}
        <section className="p-4 sm:p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5 shadow-2xs">
          <Clock className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
            <strong className="font-bold text-[#3E2312]">Service Scheduling Notice: </strong>
            Emergency door alignment, lock malfunctions, and squeaking joinery repairs are dispatched based on daily workshop capacity and carpenter routes. We never promise unconditional same-day service by default without confirming artisan availability in your locality.
          </div>
        </section>

        {/* Category Tabs */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#201A15]">
                Our Core Carpentry Services
              </h2>
              <p className="text-xs text-[#5C4D41] mt-0.5">
                Select a category to view scope, typical timelines, and quotation guidelines.
              </p>
            </div>

            <ServicesFilterTabs
              activeCategory={activeCategory}
              onSelectCategory={handleSelectCategory}
              counts={categoryCounts}
            />
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-6 rounded-3xl bg-white border border-[#E5DDD1] space-y-4">
                  <LoadingSkeleton variant="card" className="h-48 rounded-2xl" />
                  <LoadingSkeleton variant="text" className="w-3/4" />
                  <LoadingSkeleton variant="text" className="w-full" />
                  <LoadingSkeleton variant="text" className="w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error State with Recovery */}
          {errorMessage && !isLoading && (
            <div className="p-8 rounded-3xl bg-white border border-red-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-[#201A15]">Unable to Load Services</h3>
                <p className="text-xs text-[#5C4D41] max-w-md mx-auto">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => loadData(activeCategory)}
                className="px-5 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold inline-flex items-center gap-2 hover:bg-[#1E4D2B] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Loading Services</span>
              </button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !errorMessage && displayedServices.length === 0 && (
            <EmptyState
              title="No services found in this category"
              message="There are currently no active public services matching this filter. Try viewing all services or contact our workshop directly."
              actionText="View All Services"
              onActionClick={() => handleSelectCategory('all')}
            />
          )}

          {/* Services Grid */}
          {!isLoading && !errorMessage && displayedServices.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayedServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </section>

        {/* 5-Step Craftsmanship Process */}
        <ServiceProcessSection />

        {/* Regional Service Areas Grid */}
        <section className="bg-white rounded-3xl border border-[#E5DDD1] p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#8B5A2B]">
              <MapPin className="w-4 h-4" />
              <span>Service Area Feasibility</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#201A15]">
              Where We Provide On-Site Carpentry
            </h2>
            <p className="text-xs sm:text-sm text-[#5C4D41] max-w-2xl leading-relaxed">
              We prioritize localized craftsmanship to ensure prompt service, reliable material transport, and traceable quality control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {/* Vuyyuru Priority */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border-2 border-[#8B5A2B]/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8B5A2B]">Tier 1 · Primary Hub</span>
                <span className="text-[10px] font-bold bg-[#E8F2EC] text-[#2D6A4F] px-2 py-0.5 rounded-full">Fastest Dispatch</span>
              </div>
              <h3 className="font-bold text-base text-[#201A15]">Vuyyuru Town & Rural Mandal</h3>
              <p className="text-xs text-[#5C4D41] leading-relaxed">
                Direct dispatch from our workshop. Complimentary consultation visits and fast-response repair routes for all residential and business addresses in Vuyyuru town.
              </p>
            </div>

            {/* Vijayawada & Guntur */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD1] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D41]">Tier 2 · Urban Corridor</span>
                <span className="text-[10px] font-bold bg-[#FAF7F2] border border-[#E5DDD1] text-[#5C4D41] px-2 py-0.5 rounded-full">Scheduled Visits</span>
              </div>
              <h3 className="font-bold text-base text-[#201A15]">Vijayawada, Guntur & Tenali</h3>
              <p className="text-xs text-[#5C4D41] leading-relaxed">
                Scheduled weekly measurement rounds and white-glove delivery across Benz Circle, Kanna Thota, Mangalagiri, and surrounding Krishna/NTR district localities.
              </p>
            </div>

            {/* Coastal Andhra */}
            <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD1] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D41]">Tier 3 · By Project Scope</span>
                <span className="text-[10px] font-bold bg-[#FAF7F2] border border-[#E5DDD1] text-[#5C4D41] px-2 py-0.5 rounded-full">Whole-House Only</span>
              </div>
              <h3 className="font-bold text-base text-[#201A15]">Extended Coastal Andhra</h3>
              <p className="text-xs text-[#5C4D41] leading-relaxed">
                Available for complete house joinery commissions (main doors, pooja mandirs, full modular kitchens, and wardrobes) subject to travel logistics and scope review.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        {faqs.length > 0 && <ServiceFaqSection faqs={faqs} />}

        {/* Bottom Conversion CTA Strip */}
        <section className="bg-[#1C120B] rounded-3xl p-8 sm:p-12 text-center text-white space-y-5 shadow-md">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#FAF7F2] text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Artisan Consultation</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white max-w-2xl mx-auto">
            Ready to Discuss Your Woodwork Project?
          </h2>

          <p className="text-xs sm:text-sm text-[#D8CEBC] max-w-xl mx-auto leading-relaxed">
            Whether you need a quick repair or a complete solid teak interior package, our craftsmen will inspect your needs and provide a clear written quotation.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1E4D2B] text-white font-bold text-sm shadow-md hover-lift transition-all"
            >
              Submit a Service Request
            </Link>

            <a
              href="https://wa.me/918639731477?text=Hi%20Vuyyuru%20Carpentry,%20I%20would%20like%20to%20consult%20about%20a%20carpentry%20service."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md hover-lift transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </section>
      </main>

      {/* Floating Mobile Action */}
      <MobileContactAction contact={settings.contact} />

      {/* Footer */}
      <SiteFooter settings={settings} />
    </div>
  );
}
