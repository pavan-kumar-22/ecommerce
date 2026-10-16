import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CustomFurnitureClient } from './CustomFurnitureClient';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Custom Furniture Designer & Request Form | Vuyyuru Carpentry',
  description:
    'Design bespoke handcrafted teakwood furniture with Vuyyuru Carpentry in Andhra Pradesh. Submit custom room measurements, timber choices, reference photos, and request an on-site laser survey.',
  openGraph: {
    title: 'Custom Furniture Request | Vuyyuru Carpentry',
    description:
      'Guided requirements form for custom cots, wardrobes, pooja mandirs, and doors handcrafted in seasoned teakwood at our Vuyyuru workshop.',
    url: 'https://vuyyurucarpentry.com/custom-furniture',
    siteName: 'Vuyyuru Carpentry',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function CustomFurniturePage() {
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
      <CustomFurnitureClient />
    </Suspense>
  );
}
