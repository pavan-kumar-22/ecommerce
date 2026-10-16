import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ServicesClient } from './ServicesClient';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Carpentry Services & Architectural Woodwork | Vuyyuru Carpentry',
  description:
    'Explore professional carpentry services in Vuyyuru, Vijayawada, and Guntur. Door alignment, repairs, bespoke solid teak furniture, modular wardrobes, BWP marine ply kitchens, and Italian PU wood finishing.',
  openGraph: {
    title: 'Carpentry Services | Vuyyuru Carpentry',
    description:
      'From minor repairs to architectural solid wood joinery. Handcrafted by master artisans with seasoned Burma and CP teakwood in Andhra Pradesh.',
    url: 'https://vuyyurucarpentry.com/services',
    siteName: 'Vuyyuru Carpentry',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-8">
          <div className="max-w-md w-full space-y-4">
            <LoadingSkeleton variant="card" className="h-64 rounded-3xl" />
          </div>
        </div>
      }
    >
      <ServicesClient />
    </Suspense>
  );
}
