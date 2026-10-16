'use client';

import React, { useState } from 'react';
import { Layers, ShieldCheck } from 'lucide-react';
import { ProjectImage } from '@/types/api';

interface ProjectBeforeAfterViewerProps {
  beforeImage: ProjectImage;
  afterImage: ProjectImage;
  projectTitle: string;
}

export const ProjectBeforeAfterViewer: React.FC<ProjectBeforeAfterViewerProps> = ({
  beforeImage,
  afterImage,
  projectTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'after' | 'before'>('after');

  return (
    <div className="bg-[#FAF7F2] rounded-2xl border border-[#E5DDD1] p-5 sm:p-6 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-1">
            <Layers className="w-4 h-4 text-[#2D6A4F]" />
            <span>Genuine Before & After Documentation</span>
          </div>
          <h4 className="font-serif text-base sm:text-lg font-bold text-[#201A15]">
            Transformation & Conservation Evidence
          </h4>
        </div>

        {/* Toggle Controls */}
        <div
          role="tablist"
          aria-label="Before and after comparison tabs"
          className="inline-flex bg-white p-1 rounded-xl border border-[#D9CFC4] shadow-2xs self-start sm:self-auto"
        >
          <button
            role="tab"
            aria-selected={activeTab === 'before'}
            onClick={() => setActiveTab('before')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-accessible ${
              activeTab === 'before'
                ? 'bg-[#8C7A6B] text-white shadow-xs'
                : 'text-[#5C4D41] hover:text-[#201A15]'
            }`}
          >
            Before Restoration
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'after'}
            onClick={() => setActiveTab('after')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-accessible ${
              activeTab === 'after'
                ? 'bg-[#1E4D2B] text-white shadow-xs'
                : 'text-[#5C4D41] hover:text-[#201A15]'
            }`}
          >
            After Workshop Joinery
          </button>
        </div>
      </div>

      {/* Comparative Image Display */}
      <div className="relative aspect-16/9 sm:aspect-21/9 w-full bg-[#E5DDD1] rounded-xl overflow-hidden border border-[#D9CFC4]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={activeTab === 'after' ? afterImage.url : beforeImage.url}
          alt={
            activeTab === 'after'
              ? afterImage.alt || `Finished condition of ${projectTitle}`
              : beforeImage.alt || `Initial condition of ${projectTitle}`
          }
          className="w-full h-full object-cover transition-all duration-500"
        />

        <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20">
          {activeTab === 'after' ? '✓ Completed Workshop Finish' : '⚠ Initial Condition Prior to Work'}
        </div>
      </div>

      <p className="mt-3 text-[11px] text-[#6B5E55] flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
        <span>
          Both photos are authentic project captures published with explicit homeowner consent. No digital alteration or stock rendering.
        </span>
      </p>
    </div>
  );
};
