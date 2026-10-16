import React from 'react';
import Link from 'next/link';
import { MapPin, ShieldCheck, ArrowRight } from 'lucide-react';
import { PublicProject } from '../types/api';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { ErrorState } from './ui/ErrorState';

interface ProjectGalleryPreviewProps {
  projects: PublicProject[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const ProjectGalleryPreview: React.FC<ProjectGalleryPreviewProps> = ({
  projects,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  // Only display verified projects with explicit customer consent
  const verifiedProjects = projects.filter((p) => p.photoPermissionGranted === true);

  if (!isLoading && !isError && verifiedProjects.length === 0) {
    // Hide cleanly if no approved projects exist
    return null;
  }

  return (
    <section
      className="py-16 sm:py-20 bg-[#FAF7F2] border-b border-[#E5DDD1]"
      aria-labelledby="portfolio-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#1E4D2B] mb-2">
              <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
              <span>Verified Customer Installations</span>
            </div>
            <h2
              id="portfolio-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15]"
            >
              Recent Real Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E4D2B] hover:text-[#2D6A4F] focus-accessible p-1 rounded-md group"
            id="view-all-projects-link"
          >
            <span>View all completed works</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={3} />
          </div>
        )}

        {/* Error state */}
        {!isLoading && isError && (
          <ErrorState
            title="Unable to load project gallery"
            message="We could not retrieve recent completed projects at this time."
            onRetry={onRetry}
          />
        )}

        {/* Projects Grid */}
        {!isLoading && !isError && verifiedProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {verifiedProjects.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-2xl border border-[#E5DDD1] overflow-hidden hover-lift flex flex-col"
              >
                <div className="relative aspect-4/3 w-full bg-[#EFE8DC] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.coverImage.url}
                    alt={project.coverImage.alt || project.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full border border-white/20">
                    {project.year}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-[#6B3F23] block mb-1">
                      {project.category}
                    </span>
                    <h3 className="text-base font-semibold text-[#201A15] group-hover:text-[#1E4D2B] transition-colors mb-2">
                      {project.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-[#F0EAE1] flex items-center justify-between text-xs text-[#5C4D41]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
                      {project.location}
                    </span>
                    <span className="text-[11px] font-medium text-[#1E4D2B]">
                      Approved Photo
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
