'use client';

import React, { useState, useEffect, useCallback, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, X, Sparkles, ArrowRight, Tag } from 'lucide-react';
import {
  SiteSettings,
  UnifiedSearchResult,
  ProductSearchResult,
  ServiceSearchResult,
  SearchTabType,
} from '../../types/api';
import { searchUnified, getSiteSettings } from '../../lib/api-client';
import { verifiedSiteSettings } from '../../lib/public-data';

import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import { MobileContactAction } from '../../components/MobileContactAction';
import { Breadcrumb } from '../../components/catalogue/Breadcrumb';
import { ProductCard } from '../../components/ProductCard';
import { ServiceResultCard } from '../../components/search/ServiceResultCard';
import { SearchResultTabs } from '../../components/search/SearchResultTabs';
import { NoResultsPanel } from '../../components/search/NoResultsPanel';
import { RecentSearches } from '../../components/search/RecentSearches';
import { Pagination } from '../../components/catalogue/Pagination';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../components/ui/ErrorState';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // 1. Read Query Parameters
  const queryParam = searchParams.get('q') || '';
  const typeParam = (searchParams.get('type') as SearchTabType) || 'all';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  // 2. Component States
  const [settings, setSettings] = useState<SiteSettings>(verifiedSiteSettings);
  const [searchInput, setSearchInput] = useState<string>(queryParam);
  const [activeTab, setActiveTab] = useState<SearchTabType>(typeParam);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);

  const [results, setResults] = useState<UnifiedSearchResult[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [counts, setCounts] = useState<{ all: number; products: number; services: number }>({
    all: 0,
    products: 0,
    services: 0,
  });
  const [matchedCategories, setMatchedCategories] = useState<{ slug: string; name: string }[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Keep search input synced if URL changes externally
  useEffect(() => {
    setSearchInput(queryParam);
    setActiveTab(typeParam);
    setCurrentPage(pageParam);
  }, [queryParam, typeParam, pageParam]);

  // Load Settings
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await getSiteSettings();
        setSettings(res.data);
      } catch (err) {
        console.warn('Failed to load site settings:', err);
      }
    }
    loadMeta();
  }, []);

  // Update URL Query Parameters
  const pushUrlState = useCallback(
    (newQ: string, newType: SearchTabType, newPage: number) => {
      const params = new URLSearchParams();
      if (newQ.trim()) params.set('q', newQ.trim());
      if (newType !== 'all') params.set('type', newType);
      if (newPage > 1) params.set('page', newPage.toString());

      const qs = params.toString();
      startTransition(() => {
        router.push(`/search${qs ? `?${qs}` : ''}`);
      });
    },
    [router]
  );

  // Execute Search Fetch
  const executeSearch = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await searchUnified({
        q: queryParam,
        type: activeTab,
        page: currentPage,
        limit: 12,
      });

      const data = res.data;
      setResults(data.items || []);
      setTotalItems(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setCounts(data.counts || { all: 0, products: 0, services: 0 });
      setMatchedCategories(data.matchedCategories || []);
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error('Search fetch error:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [queryParam, activeTab, currentPage]);

  useEffect(() => {
    executeSearch();
  }, [executeSearch]);

  // Submit Search Form
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      pushUrlState(searchInput.trim(), 'all', 1);
    }
  };

  // Tab Selection
  const handleTabChange = (tab: SearchTabType) => {
    setActiveTab(tab);
    setCurrentPage(1);
    pushUrlState(queryParam, tab, 1);
  };

  // Suggestion or Recent Search Click
  const handleSelectTerm = (term: string) => {
    setSearchInput(term);
    pushUrlState(term, 'all', 1);
  };

  // Page Navigation
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    pushUrlState(queryParam, activeTab, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Separate Products and Services for rendering
  const productItems = results.filter((r) => r.kind === 'product') as ProductSearchResult[];
  const serviceItems = results.filter((r) => r.kind === 'service') as ServiceSearchResult[];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#201A15] relative pb-20 sm:pb-0">
      {/* 1. Header Navigation */}
      <SiteHeader settings={settings} />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        {/* 2. Breadcrumbs */}
        <Breadcrumb items={[{ label: 'Search' }]} />

        {/* 3. Search Header & Safe Query Rendering */}
        <div className="pt-2 pb-6 border-b border-[#E5DDD1]">
          {queryParam.trim() ? (
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15] tracking-tight">
                Search results for &ldquo;
                <span className="text-[#1E4D2B] break-words">{queryParam}</span>
                &rdquo;
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4D41] mt-1.5" id="search-result-count-label">
                Showing <strong className="text-[#201A15]">{totalItems}</strong> matching{' '}
                {activeTab === 'all' ? 'items' : activeTab}
              </p>
            </div>
          ) : (
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15] tracking-tight">
                Search Furniture & Carpentry Services
              </h1>
              <p className="text-xs sm:text-sm text-[#5C4D41] mt-1.5">
                Search for bespoke teakwood furniture, modular kitchens, wardrobes, doors, or
                carpentry repair services.
              </p>
            </div>
          )}
        </div>

        {/* 4. Search Input Field */}
        <div className="py-6 max-w-2xl">
          <form onSubmit={handleFormSubmit} role="search" className="relative flex items-center">
            <label htmlFor="search-page-input" className="sr-only">
              Search by name, category, or wood species
            </label>
            <input
              id="search-page-input"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="What are you looking for? (e.g., Teak bed, Pooja mandir, Repairs)"
              className="w-full bg-white border border-[#E5DDD1] rounded-2xl pl-11 pr-24 py-3.5 text-sm text-[#201A15] placeholder-[#8C7E72] focus:border-[#2D6A4F] focus:ring-2 focus:ring-[#2D6A4F]/20 focus:outline-none shadow-xs"
            />
            <Search className="w-5 h-5 text-[#8C7E72] absolute left-3.5 pointer-events-none" />

            <div className="absolute right-2 flex items-center gap-1">
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="p-1.5 text-[#8C7E72] hover:text-[#201A15] rounded-full"
                  aria-label="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#1E4D2B] text-white text-xs font-semibold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs"
              >
                Search
              </button>
            </div>
          </form>

          {/* Recent Searches Bar */}
          <RecentSearches onSelectSearch={handleSelectTerm} currentQuery={queryParam} />
        </div>

        {/* 5. Result-Type Tabs (All / Products / Services) */}
        {queryParam.trim() && !isError && (
          <div className="mb-6">
            <SearchResultTabs
              activeTab={activeTab}
              counts={counts}
              onSelectTab={handleTabChange}
            />
          </div>
        )}

        {/* 6. Matched Suggested Category Chips */}
        {matchedCategories.length > 0 && (
          <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-xs font-semibold text-[#6B3F23] flex items-center gap-1 shrink-0">
              <Tag className="w-3.5 h-3.5" />
              <span>Related Categories:</span>
            </span>
            {matchedCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="shrink-0 text-xs font-medium px-3 py-1 bg-white border border-[#E5DDD1] rounded-full text-[#5C4D41] hover:text-[#1E4D2B] hover:border-[#1E4D2B]/40 transition-colors shadow-2xs"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        {/* 7. Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <LoadingSkeleton variant="card" count={3} />
            </div>
          </div>
        )}

        {/* 8. Error State */}
        {!isLoading && isError && (
          <ErrorState
            title="Search service temporarily unavailable"
            message="We could not complete your search query. Please click retry to query the workshop catalog again."
            onRetry={executeSearch}
          />
        )}

        {/* 9. Empty State (No query provided) */}
        {!isLoading && !isError && !queryParam.trim() && (
          <div className="py-12 text-center max-w-xl mx-auto bg-white rounded-2xl border border-[#E5DDD1] p-8 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#E8F2EC] text-[#1E4D2B] flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-[#201A15] mb-1">Enter a keyword to start searching</h2>
            <p className="text-xs text-[#5C4D41] mb-6">
              Search by item name, wood species (e.g. Burma Teak, Marine Ply), or browse our popular
              categories.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((sugg) => (
                <button
                  key={sugg}
                  onClick={() => handleSelectTerm(sugg)}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF7F2] border border-[#E5DDD1] text-[#201A15] hover:bg-[#EFE8DC] transition-colors focus-accessible shadow-2xs"
                >
                  {sugg}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 10. No Results State (Query had 0 matches) */}
        {!isLoading && !isError && queryParam.trim() && results.length === 0 && (
          <NoResultsPanel
            query={queryParam}
            suggestions={suggestions}
            onSelectSuggestion={handleSelectTerm}
          />
        )}

        {/* 11. Results Display */}
        {!isLoading && !isError && results.length > 0 && (
          <div className="space-y-10">
            {/* A. Services Section (if any match and tab is all or services) */}
            {serviceItems.length > 0 && (activeTab === 'all' || activeTab === 'services') && (
              <section aria-labelledby="services-results-heading">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD1] mb-4">
                  <h2
                    id="services-results-heading"
                    className="text-sm font-bold uppercase tracking-wider text-[#6B3F23]"
                  >
                    Carpentry & Interior Services ({serviceItems.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {serviceItems.map((service) => (
                    <ServiceResultCard key={service.id} service={service} />
                  ))}
                </div>
              </section>
            )}

            {/* B. Products Section (if any match and tab is all or products) */}
            {productItems.length > 0 && (activeTab === 'all' || activeTab === 'products') && (
              <section aria-labelledby="products-results-heading">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5DDD1] mb-6">
                  <h2
                    id="products-results-heading"
                    className="text-sm font-bold uppercase tracking-wider text-[#6B3F23]"
                  >
                    Workshop Furniture Pieces ({productItems.length})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {productItems.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={{
                        id: prod.id,
                        name: prod.title,
                        slug: prod.slug,
                        shortDescription: prod.summary,
                        categoryId: '',
                        categorySlug: prod.categorySlug,
                        categoryName: prod.categoryName,
                        primaryImage: prod.imageUrl ? { url: prod.imageUrl, alt: prod.title } : null,
                        woodSpecies: prod.woodSpecies || [],
                        priceMode: prod.priceMode,
                        salePricePaise: prod.salePricePaise,
                        startingPricePaise: prod.startingPricePaise,
                        currency: 'INR',
                        status: 'active',
                        visibility: 'public',
                        isCustomizable: prod.isCustomizable,
                        availabilityLabel: prod.availabilityLabel as any,
                      }}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* C. Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                limit={12}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        )}

        {/* 12. Made-to-Measure Custom Work Callout */}
        <div className="mt-14 pt-8 border-t border-[#E5DDD1] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-2xs">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1E4D2B] mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Architectural Woodwork</span>
            </div>
            <h3 className="text-base font-bold text-[#201A15]">
              Looking for something custom-built to your room dimensions?
            </h3>
            <p className="text-xs text-[#5C4D41] mt-0.5">
              Submit your rough layout, timber preferences, and receive an itemized quotation.
            </p>
          </div>
          <Link
            href="/custom-furniture"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E4D2B] text-white text-xs font-semibold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs"
          >
            <span>Request custom furniture</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      {/* 13. Footer & Mobile Contact Bar */}
      <SiteFooter settings={settings} />
      <MobileContactAction contact={settings.contact} />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF7F2] p-8 text-center text-sm font-semibold text-[#5C4D41]">
          Loading search results...
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
