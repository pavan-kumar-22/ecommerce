'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Sparkles,
  Home,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { PublicProject } from '@/types/api';
import { getPublicProjects } from '@/lib/api-client';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectsFilterBar, CategoryOption } from '@/components/projects/ProjectsFilterBar';
import { ProjectsPagination } from '@/components/projects/ProjectsPagination';
import { LoadingSkeleton } from '@/components/ui/LoadingSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';

export function ProjectsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL state synchronization
  const initialCategory = searchParams.get('category') || 'all';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);
  const initialSearch = searchParams.get('q') || '';

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Sync state to URL without full reload
  const updateUrl = useCallback(
    (cat: string, page: number, query: string) => {
      const params = new URLSearchParams();
      if (cat && cat !== 'all') params.set('category', cat);
      if (page > 1) params.set('page', page.toString());
      if (query.trim()) params.set('q', query.trim());

      const qs = params.toString() ? `?${params.toString()}` : '';
      router.replace(`/projects${qs}`, { scroll: false });
    },
    [router]
  );

  // Load projects from API with fallback
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const res = await getPublicProjects({
        category: activeCategory,
        search: searchQuery,
        page: currentPage,
        limit: 9,
      });

      setProjects(res.data.items);
      setTotalProjects(res.data.total);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchQuery, currentPage]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Handlers
  const handleSelectCategory = (catId: string) => {
    setActiveCategory(catId);
    setCurrentPage(1);
    updateUrl(catId, 1, searchQuery);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    updateUrl(activeCategory, 1, query);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl(activeCategory, page, searchQuery);
    window.scrollTo({ top: 280, behavior: 'smooth' });
  };

  const handleClearFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setCurrentPage(1);
    updateUrl('all', 1, '');
  };

  // Category definition with display counts
  const categories: CategoryOption[] = useMemo(
    () => [
      { id: 'all', label: 'All Projects' },
      { id: 'furniture', label: 'Custom Furniture' },
      { id: 'doors', label: 'Doors & Frames' },
      { id: 'wardrobes', label: 'Wardrobes & Storage' },
      { id: 'interiors', label: 'Interior Joinery' },
      { id: 'repairs', label: 'Repairs & Restorations' },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumbs"
        className="bg-[#F5EFEB] border-b border-[#E5DDD1] py-3 text-xs text-[#6B5E55]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ol className="flex items-center gap-2">
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
            <li aria-current="page" className="font-semibold text-[#201A15]">
              Completed Projects
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-[#201A15] text-[#FAF7F2] py-14 sm:py-20 overflow-hidden border-b border-[#3E2312]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,106,79,0.22),transparent_60%)] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-[#1E4D2B]/80 text-[#FAF7F2] text-xs font-semibold px-3 py-1 rounded-full mb-4 border border-[#2D6A4F]/60">
              <ShieldCheck className="w-4 h-4 text-[#A5D6A7]" />
              <span>Genuine Andhra Installations · Verified Client Consent</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">
              Our Carpentry Work
            </h1>

            <p className="text-sm sm:text-base text-[#D9CFC4] leading-relaxed mb-8">
              Explore authentic completed projects across Vuyyuru, Vijayawada, Guntur, and nearby
              mandals. From handcrafted Burma teak pooja mandirs and solid main doors to fitted
              wardrobes and antique restorations—every piece reflects generational craftsmanship
              and traceable timber joinery.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/custom-furniture"
                className="inline-flex items-center gap-2 bg-[#1E4D2B] hover:bg-[#2D6A4F] text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all focus-accessible"
              >
                <Sparkles className="w-4 h-4" />
                <span>Request Custom Furniture</span>
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-[#FAF7F2] px-5 py-2.5 rounded-xl font-semibold text-sm border border-white/20 transition-all focus-accessible"
              >
                <span>Browse All Services</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Filter and Search Bar */}
        <ProjectsFilterBar
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          totalResults={totalProjects}
        />

        {/* Loading State */}
        {isLoading && (
          <div
            data-testid="projects-loading-skeleton"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            <LoadingSkeleton variant="card" count={6} />
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <ErrorState
            title="Unable to load completed projects"
            message="We encountered an issue retrieving the project portfolio from the server. Please verify your connection and try again."
            onRetry={loadProjects}
          />
        )}

        {/* Empty State */}
        {!isLoading && !isError && projects.length === 0 && (
          <div data-testid="projects-empty-state">
            <EmptyState
              title="No projects match your filter"
              message={
                searchQuery
                  ? `We could not find any published projects matching "${searchQuery}". Try adjusting your keywords or clearing the category filter.`
                  : 'There are currently no approved projects published in this category. Our artisans continuously document new completed works.'
              }
              actionText="Reset All Filters"
              onActionClick={handleClearFilters}
            />
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !isError && projects.length > 0 && (
          <div>
            <div
              data-testid="projects-grid"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            >
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {/* Pagination */}
            <ProjectsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {/* Privacy & Quality Commitment Banner */}
        <section
          aria-labelledby="trust-banner-heading"
          className="mt-16 bg-white rounded-2xl border border-[#E5DDD1] p-6 sm:p-8 shadow-xs"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-2">
                <Lock className="w-4 h-4 text-[#2D6A4F]" />
                <span id="trust-banner-heading">Client Privacy & Scope Disclosure Policy</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15] mb-2">
                Authentic Photography, Zero Privacy Compromise
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4D41] leading-relaxed">
                In strict compliance with Vuyyuru Carpentry business ethics, customer home addresses,
                phone numbers, and final invoice amounts are strictly confidential. Every photo is
                taken on site with explicit permission. Prices shown across the website are governed
                by formal written quotations following laser site measurements.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              <div className="flex items-center gap-2 text-xs font-medium text-[#201A15]">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>100% Genuine Project Photographs</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#201A15]">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>No Fabricated Stock Renderings</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-[#201A15]">
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                <span>Written Quotations Before Any Work</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
