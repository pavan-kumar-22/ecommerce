'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  ChevronRight,
  MapPin,
  Calendar,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
  MessageSquareQuote,
  Hammer,
} from 'lucide-react';
import { PublicProject, ProjectImage } from '@/types/api';
import { getPublicProjectBySlug } from '@/lib/api-client';
import { ProjectBeforeAfterViewer } from '@/components/projects/ProjectBeforeAfterViewer';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';

interface ProjectDetailClientProps {
  slug: string;
}

export function ProjectDetailClient({ slug }: ProjectDetailClientProps) {
  const [project, setProject] = useState<PublicProject | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      try {
        const res = await getPublicProjectBySlug(slug);
        setProject(res.data);
      } catch (err) {
        setProject(null);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSkeleton variant="card" count={2} />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <EmptyState
            title="Project not found or private"
            message="This project is either unpublished, pending client photography consent, or has been archived. Only approved client installations are visible publicly."
            actionText="Return to Projects Gallery"
            actionHref="/projects"
          />
        </div>
      </div>
    );
  }

  const images: ProjectImage[] =
    project.images && project.images.length > 0
      ? project.images
      : project.coverImage
      ? [{ url: project.coverImage.url, alt: project.coverImage.alt || project.title, kind: 'finished' }]
      : [];

  const currentImage = images[activeImageIndex] || images[0];

  // Check for genuine before & after photos
  const beforePhoto = images.find((img) => img.kind === 'before');
  const afterPhoto = images.find((img) => img.kind === 'after');
  const hasComparativePhotos = Boolean(beforePhoto && afterPhoto);

  const fallbackUrl =
    'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80';

  const similarHref = `/custom-furniture?project=${encodeURIComponent(
    project.slug
  )}&category=${encodeURIComponent(project.category)}&reference=${encodeURIComponent(
    project.title
  )}`;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumbs"
        className="bg-[#F5EFEB] border-b border-[#E5DDD1] py-3 text-xs text-[#6B5E55]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2 flex-wrap">
            <li>
              <Link
                href="/"
                className="hover:text-[#1E4D2B] transition-colors flex items-center gap-1 focus-accessible rounded-sm"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-[#A89A8E]" />
            <li>
              <Link
                href="/projects"
                className="hover:text-[#1E4D2B] transition-colors focus-accessible rounded-sm"
              >
                Completed Projects
              </Link>
            </li>
            <ChevronRight className="w-3.5 h-3.5 text-[#A89A8E]" />
            <li aria-current="page" className="font-semibold text-[#201A15] truncate max-w-xs">
              {project.title}
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#1E4D2B] hover:text-[#2D6A4F] focus-accessible p-1 rounded-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Completed Projects</span>
          </Link>
        </div>

        {/* Header Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="bg-[#1E4D2B] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {project.category}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#EFE8DC] text-[#3E2312] px-3 py-1 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>{project.generalArea || project.location || 'Vuyyuru'}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium bg-[#EFE8DC] text-[#3E2312] px-3 py-1 rounded-full">
              <Calendar className="w-3.5 h-3.5 text-[#6B3F23]" />
              <span>{project.completedAt || `Completed ${project.year}`}</span>
            </span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15] mb-3 leading-tight">
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-[#5C4D41] leading-relaxed max-w-4xl">
            {project.summary}
          </p>
        </div>

        {/* Primary Gallery Display */}
        <div className="mb-8 bg-white rounded-2xl border border-[#E5DDD1] p-4 sm:p-6 shadow-xs">
          <div className="relative aspect-16/10 w-full bg-[#E5DDD1] rounded-xl overflow-hidden mb-4 border border-[#E5DDD1]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageError ? fallbackUrl : currentImage.url}
              alt={currentImage.alt || project.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs font-medium px-3 py-1 rounded-full border border-white/20">
              Approved Client Capture
            </div>
          </div>

          {/* Thumbnails Navigation */}
          {images.length > 1 && (
            <div
              role="tablist"
              aria-label="Project photo gallery"
              className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none"
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={idx === activeImageIndex}
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setImageError(false);
                  }}
                  className={`relative w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden shrink-0 border-2 transition-all focus-accessible ${
                    idx === activeImageIndex
                      ? 'border-[#1E4D2B] ring-2 ring-[#1E4D2B]/30 scale-102'
                      : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1}: ${img.alt || project.title}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt || `Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Before and After Comparison Section */}
        {hasComparativePhotos && beforePhoto && afterPhoto && (
          <ProjectBeforeAfterViewer
            beforeImage={beforePhoto}
            afterImage={afterPhoto}
            projectTitle={project.title}
          />
        )}

        {/* Two-Column Specification & Scope */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column: Scope & Description */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white rounded-2xl border border-[#E5DDD1] p-6 sm:p-8 shadow-xs">
              <h2 className="font-serif text-xl font-bold text-[#201A15] mb-4 flex items-center gap-2">
                <Hammer className="w-5 h-5 text-[#1E4D2B]" />
                <span>Craftsmanship & Project Overview</span>
              </h2>

              <p className="text-xs sm:text-sm text-[#4A3E36] leading-relaxed mb-6 whitespace-pre-line">
                {project.description || project.summary}
              </p>

              {project.scopeHighlights && project.scopeHighlights.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B3F23] mb-3">
                    Verified Execution Scope
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-[#5C4D41]">
                    {project.scopeHighlights.map((scope, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
                        <span>{scope}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Testimonial Quote (Anonymous/Approved) */}
            {project.clientFeedbackQuote && (
              <section className="bg-[#FAF7F2] rounded-2xl border border-[#E5DDD1] p-6 sm:p-7 shadow-xs">
                <div className="flex items-start gap-3">
                  <MessageSquareQuote className="w-6 h-6 text-[#1E4D2B] shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-1">
                      Homeowner Experience
                    </h3>
                    <blockquote className="font-serif italic text-sm sm:text-base text-[#201A15] leading-relaxed mb-2">
                      &ldquo;{project.clientFeedbackQuote}&rdquo;
                    </blockquote>
                    <p className="text-[11px] text-[#6B5E55]">
                      Verified client in {project.generalArea || 'Andhra Pradesh'} · Identity protected under privacy policy
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Timber, Hardware & Action Box */}
          <div className="space-y-6">
            {/* Timber & Materials Specification Box */}
            <div className="bg-white rounded-2xl border border-[#E5DDD1] p-6 shadow-xs">
              <h3 className="font-serif text-base font-bold text-[#201A15] mb-4">
                Materials & Timber Species
              </h3>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.materialsUsed.map((mat, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold bg-[#F5EFEB] text-[#6B3F23] px-3 py-1.5 rounded-lg border border-[#E5DDD1]"
                  >
                    {mat}
                  </span>
                ))}
              </div>

              <div className="text-[11px] text-[#5C4D41] bg-[#FAF7F2] p-3.5 rounded-xl border border-[#E5DDD1] leading-relaxed">
                <span className="font-semibold text-[#201A15] block mb-1">Timber Quality Guarantee</span>
                All solid hardwoods are sourced as seasoned, kiln-treated timber with moisture tolerance suited to the coastal Andhra climate.
              </div>
            </div>

            {/* Request Similar Action Card */}
            <div className="bg-[#1E4D2B] text-white rounded-2xl p-6 shadow-md border border-[#2D6A4F]">
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#A5D6A7]" />
                <span>Bespoke Commissioning</span>
              </div>

              <h3 className="font-serif text-lg font-bold mb-2">
                Want a Similar Piece for Your Home?
              </h3>

              <p className="text-xs text-white/80 leading-relaxed mb-5">
                Every home has unique dimensions. Commission a made-to-measure design tailored to your space with a laser measurement survey.
              </p>

              <Link
                href={similarHref}
                id="request-similar-piece-btn"
                className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#1E4D2B] hover:bg-[#FAF7F2] font-bold text-xs sm:text-sm py-3 px-4 rounded-xl shadow-xs transition-colors focus-accessible"
              >
                <span>Request Similar Carpentry</span>
              </Link>
            </div>

            {/* Privacy Compliance Disclosure */}
            <div className="p-4 bg-[#F5EFEB] rounded-xl border border-[#E5DDD1] text-[11px] text-[#6B5E55] flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
              <span>
                To protect client privacy, exact street addresses, telephone records, and private invoices are never published.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
