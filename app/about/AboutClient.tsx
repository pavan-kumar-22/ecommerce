'use client';

import React, { useState, useEffect } from 'react';
import { PublicAboutContent } from '@/types/api';
import { getPublicAbout } from '@/lib/api-client';
import { AboutHeroSection } from '@/components/about/AboutHeroSection';
import { AboutStorySection } from '@/components/about/AboutStorySection';
import { AboutValuesGrid } from '@/components/about/AboutValuesGrid';
import { AboutProcessSection } from '@/components/about/AboutProcessSection';
import { AboutServiceAreaSection } from '@/components/about/AboutServiceAreaSection';
import { AboutContactCard } from '@/components/about/AboutContactCard';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { ErrorState } from '@/components/ui/ErrorState';

export function AboutClient() {
  const [content, setContent] = useState<PublicAboutContent | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const loadAboutContent = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getPublicAbout();
      setContent(res.data);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAboutContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7]">
        <div className="bg-[#201A15] py-16 px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="w-40 h-5 bg-white/20 rounded-md animate-pulse" />
            <div className="w-3/4 h-10 bg-white/20 rounded-md animate-pulse" />
            <div className="w-1/2 h-6 bg-white/20 rounded-md animate-pulse" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
          <LoadingSkeleton variant="card" count={3} />
        </div>
      </div>
    );
  }

  if (isError || !content) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <ErrorState
            title="Unable to load about information"
            message="We encountered an issue loading business details from the server. Please verify your connection and try again."
            onRetry={loadAboutContent}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Section with Breadcrumbs & CTAs */}
      <AboutHeroSection
        headline={content.headline}
        subheading={content.subheading}
        businessName={content.businessName}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Story & Background with Optional Approved Workshop Photo */}
        <AboutStorySection
          paragraphs={content.storyParagraphs}
          teamStatement={content.teamStatement}
          workshopPhoto={content.workshopPhoto}
        />

        {/* Supportable Operating Values */}
        <AboutValuesGrid values={content.values} />

        {/* 5-Stage Craftsmanship Process */}
        <AboutProcessSection steps={content.processSteps} />

        {/* Regional Reach & Feasibility Tiers */}
        <AboutServiceAreaSection serviceAreaStatement={content.serviceAreaStatement} />

        {/* Verified Contact Details Card */}
        <AboutContactCard contactSummary={content.contactSummary} />
      </main>
    </div>
  );
}
