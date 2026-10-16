'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, ShieldCheck, Layers, Sparkles } from 'lucide-react';
import { PublicProject } from '@/types/api';

interface ProjectCardProps {
  project: PublicProject;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [imageError, setImageError] = useState(false);

  // Extract primary display image
  const displayImage =
    project.images && project.images.length > 0
      ? project.images[0]
      : project.coverImage || {
          url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
          alt: project.title,
        };

  // Check if before/after comparative photos exist
  const hasComparativePhotos =
    project.images &&
    project.images.some((img) => img.kind === 'before') &&
    project.images.some((img) => img.kind === 'after');

  const fallbackUrl =
    'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=800&q=80';

  const categoryLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'furniture':
        return 'Custom Furniture';
      case 'doors':
        return 'Doors & Frames';
      case 'wardrobes':
        return 'Fitted Wardrobes';
      case 'interiors':
        return 'Interior Joinery';
      case 'repairs':
        return 'Repair & Restoration';
      default:
        return cat.charAt(0).toUpperCase() + cat.slice(1);
    }
  };

  const similarHref = `/custom-furniture?project=${encodeURIComponent(
    project.slug
  )}&category=${encodeURIComponent(project.category)}&reference=${encodeURIComponent(
    project.title
  )}`;

  return (
    <article
      data-testid="project-card"
      id={`project-card-${project.slug}`}
      className="group bg-white rounded-2xl border border-[#E5DDD1] overflow-hidden hover-lift flex flex-col transition-all duration-300 shadow-xs hover:shadow-md"
      aria-labelledby={`project-title-${project.slug}`}
    >
      {/* Media Container */}
      <div className="relative aspect-4/3 w-full bg-[#EFE8DC] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageError ? fallbackUrl : displayImage.url}
          alt={displayImage.alt || project.title}
          loading="lazy"
          onError={() => setImageError(true)}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1 bg-[#201A15]/80 backdrop-blur-md text-[#FAF7F2] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/15">
            {categoryLabel(project.category)}
          </span>

          <div className="flex items-center gap-1.5">
            {hasComparativePhotos && (
              <span className="inline-flex items-center gap-1 bg-[#1E4D2B]/90 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-full border border-white/20">
                <Layers className="w-3 h-3" />
                <span>Before & After</span>
              </span>
            )}
            <span className="bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-0.5 rounded-full border border-white/20">
              {project.year}
            </span>
          </div>
        </div>

        {/* Bottom Location Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-[#3E2312] text-xs font-medium px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
          <span>{project.generalArea || project.location || 'Vuyyuru'}</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#1E4D2B] mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>Verified Client Installation</span>
          </div>

          <h3
            id={`project-title-${project.slug}`}
            className="font-serif text-lg font-bold text-[#201A15] group-hover:text-[#1E4D2B] transition-colors leading-snug mb-2"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="hover:underline focus-accessible rounded-sm"
            >
              {project.title}
            </Link>
          </h3>

          <p className="text-xs sm:text-sm text-[#5C4D41] line-clamp-2 leading-relaxed mb-4">
            {project.summary}
          </p>

          {/* Materials & Wood Tags */}
          {project.materialsUsed && project.materialsUsed.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-5">
              {project.materialsUsed.slice(0, 3).map((mat, i) => (
                <span
                  key={i}
                  className="text-[11px] font-medium bg-[#F5EFEB] text-[#6B3F23] px-2 py-0.5 rounded-md border border-[#E5DDD1]"
                >
                  {mat}
                </span>
              ))}
              {project.materialsUsed.length > 3 && (
                <span className="text-[11px] text-[#8C7A6B] py-0.5 px-1">
                  +{project.materialsUsed.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="pt-4 border-t border-[#F0EAE1] flex items-center justify-between gap-3">
          <Link
            href={`/projects/${project.slug}`}
            className="text-xs font-semibold text-[#201A15] hover:text-[#1E4D2B] inline-flex items-center gap-1 group/btn focus-accessible p-1 rounded-md"
            aria-label={`View full details for ${project.title}`}
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>

          <Link
            href={similarHref}
            id={`similar-cta-${project.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1E4D2B] bg-[#E8F5E9] hover:bg-[#C8E6C9] px-3 py-1.5 rounded-lg border border-[#A5D6A7] transition-colors focus-accessible shadow-xs"
            aria-label={`Request similar carpentry based on ${project.title}`}
          >
            <Sparkles className="w-3 h-3 text-[#2D6A4F]" />
            <span>Request Similar</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
