import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { AboutClient } from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us · Grounded Local Craftsmanship | Vuyyuru Carpentry',
  description:
    'Learn about Vuyyuru Carpentry: an active joinery workshop serving Vuyyuru town, Vijayawada, Guntur, and nearby mandals with seasoned teakwood furniture, clear written scope, and realistic scheduling.',
  keywords: [
    'about Vuyyuru Carpentry',
    'carpenter workshop Vuyyuru',
    'teakwood furniture makers Andhra Pradesh',
    'Krishna district joinery team',
    'custom woodwork business values',
  ],
  openGraph: {
    title: 'About Vuyyuru Carpentry · Local Joinery & Custom Woodwork',
    description:
      'Community-rooted joinery workshop in Vuyyuru, Andhra Pradesh. Made-to-measure teak furniture, entrance doors, and fitted interiors built with clear scope and honest scheduling.',
    url: 'https://vuyyurucarpentry.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1E4D2B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#5C4D41] font-medium">Loading about information...</p>
          </div>
        </div>
      }
    >
      <AboutClient />
    </Suspense>
  );
}
