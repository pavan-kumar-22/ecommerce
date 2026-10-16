import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { ProjectsClient } from './ProjectsClient';

export const metadata: Metadata = {
  title: 'Completed Carpentry Projects & Portfolio | Vuyyuru Carpentry',
  description:
    'Explore authentic completed woodwork projects across Vuyyuru, Vijayawada, Guntur, and nearby Andhra regions. Real installations of teakwood mandirs, doors, wardrobes, and modular kitchens published with explicit client consent.',
  keywords: [
    'carpentry portfolio Vuyyuru',
    'completed woodworking projects Andhra Pradesh',
    'teakwood door installations Vijayawada',
    'modular kitchen joinery Guntur',
    'pooja mandir woodwork Vuyyuru',
    'custom furniture gallery',
  ],
  openGraph: {
    title: 'Completed Carpentry Projects & Portfolio | Vuyyuru Carpentry',
    description:
      'Genuine residential and commercial woodworking projects crafted in Vuyyuru, Andhra Pradesh. Handcrafted teak furniture, doors, wardrobes, and custom interiors.',
    url: 'https://vuyyurucarpentry.com/projects',
    type: 'website',
  },
};

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-[#1E4D2B] border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-[#5C4D41] font-medium">Loading project portfolio...</p>
          </div>
        </div>
      }
    >
      <ProjectsClient />
    </Suspense>
  );
}
