'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PublicService, GeneralEnquiryPayload, GeneralEnquiryResponse } from '@/types/api';
import { getPublicServices, submitGeneralEnquiry } from '@/lib/api-client';
import { ContactHeroSection } from '@/components/contact/ContactHeroSection';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactConfirmation } from '@/components/contact/ContactConfirmation';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { AlertCircle, Clock, ShieldCheck, MapPin } from 'lucide-react';

export function ContactClient() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service') || '';

  const [services, setServices] = useState<PublicService[]>([]);
  const [initialServiceId, setInitialServiceId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<boolean>(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<GeneralEnquiryResponse | null>(null);

  useEffect(() => {
    async function loadServices() {
      setIsLoading(true);
      setLoadError(false);
      try {
        const res = await getPublicServices();
        const activeServices = res.data;
        setServices(activeServices);

        // Validate incoming serviceParam against active public services
        if (serviceParam) {
          const matched = activeServices.find(
            (s) =>
              s.slug.toLowerCase() === serviceParam.toLowerCase() ||
              s.id.toLowerCase() === serviceParam.toLowerCase()
          );
          if (matched) {
            setInitialServiceId(matched.slug);
          }
        }
      } catch (err) {
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadServices();
  }, [serviceParam]);

  const handleSubmit = async (payload: GeneralEnquiryPayload) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const response = await submitGeneralEnquiry(payload);
      setConfirmation(response);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } catch (err: any) {
      setServerError(
        err.message ||
          'Failed to submit your enquiry. Your form details have been preserved. Please retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfirmation(null);
    setServerError(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <ContactHeroSection />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Urgent Service & Capacity Reminder Banner */}
        <div className="mb-8 p-4 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl flex items-start gap-3.5 text-xs text-[#92400E]">
          <Clock className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-[#78350F] block mb-0.5">
              Service Area & Scheduling Notice:
            </span>
            Vuyyuru Carpentry is based in Vuyyuru, Andhra Pradesh. We prioritize jobs in Vuyyuru
            mandal first, and nearby areas across Vijayawada, Guntur, and Tenali subject to travel
            feasibility and active artisan capacity. We never promise unconditional same-day service.
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <LoadingSkeleton variant="card" count={2} />
          </div>
        )}

        {/* Load Error State */}
        {!isLoading && loadError && (
          <ErrorState
            title="Unable to load services"
            message="We could not retrieve active carpentry services from our workshop server. Please check your network and retry."
            onRetry={() => window.location.reload()}
          />
        )}

        {/* Form or Confirmation Display */}
        {!isLoading && !loadError && (
          <>
            {confirmation ? (
              <ContactConfirmation response={confirmation} onReset={handleReset} />
            ) : (
              <ContactForm
                services={services}
                initialServiceId={initialServiceId}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                serverError={serverError}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
