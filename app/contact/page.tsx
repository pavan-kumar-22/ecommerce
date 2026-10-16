import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ContactClient } from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact & Site-Visit Request | Vuyyuru Carpentry',
  description:
    'Tell us about your carpentry repair, custom teakwood furniture, or interior joinery project. Submit your requirements or request a preferred site visit across Vuyyuru, Vijayawada, and Krishna district.',
  keywords: [
    'contact Vuyyuru Carpentry',
    'carpentry site visit request',
    'carpenter in Vuyyuru phone number',
    'wood repair enquiry Andhra Pradesh',
    'teak door inspection Vijayawada',
    'custom furniture consultation',
  ],
  openGraph: {
    title: 'Contact & Site-Visit Request · Vuyyuru Carpentry',
    description:
      'Share your woodwork requirements and preferred contact method. Request a site visit in Vuyyuru and surrounding Krishna district localities.',
    url: 'https://vuyyurucarpentry.com/contact',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1E4D2B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#5C4D41] font-medium">Loading contact form...</p>
          </div>
        </div>
      }
    >
      <ContactClient />
    </Suspense>
  );
}
