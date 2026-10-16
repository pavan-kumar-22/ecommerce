'use client';

import React, { useState, useEffect, useCallback, useTransition, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { PublicProduct, ServiceCategory, SiteSettings } from '../../types/api';
import { getProducts, getCategories, getSiteSettings } from '../../lib/api-client';
import { verifiedSiteSettings, verifiedCategories } from '../../lib/public-data';

import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import { MobileContactAction } from '../../components/MobileContactAction';
import { Breadcrumb } from '../../components/catalogue/Breadcrumb';
import { CategoryChips } from '../../components/catalogue/CategoryChips';
import { FilterDrawer, FilterState } from '../../components/catalogue/FilterDrawer';
import { ProductCard } from '../../components/ProductCard';
import { Pagination } from '../../components/catalogue/Pagination';
import { CustomWorkBanner } from '../../components/catalogue/CustomWorkBanner';
import { LoadingSkeleton } from '../../components/ui/LoadingSkeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';

function CatalogueContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // 1. Read URL Query Parameters
  const initialCategory = searchParams.get('category') || 'all';
  const initialPriceMode = searchParams.get('priceMode') || 'all';
  const initialPriceMin = searchParams.get('priceMin') || '';
  const initialPriceMax = searchParams.get('priceMax') || '';
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialSort = searchParams.get('sort') || 'recommended';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // 2. Component States
  const [settings, setSettings] = useState<SiteSettings>(verifiedSiteSettings);
  const [categories, setCategories] = useState<ServiceCategory[]>(verifiedCategories);

  const [products, setProducts] = useState<PublicProduct[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);

  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    category: initialCategory,
    priceMode: initialPriceMode,
    priceMin: initialPriceMin,
    priceMax: initialPriceMax,
    sort: initialSort,
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // 3. Synchronize State to URL
  const updateUrlParams = useCallback(
    (newFilters: FilterState, search: string, page: number) => {
      const params = new URLSearchParams();

      if (newFilters.category && newFilters.category !== 'all') {
        params.set('category', newFilters.category);
      }
      if (newFilters.priceMode && newFilters.priceMode !== 'all') {
        params.set('priceMode', newFilters.priceMode);
      }
      if (newFilters.priceMin) {
        params.set('priceMin', newFilters.priceMin);
      }
      if (newFilters.priceMax) {
        params.set('priceMax', newFilters.priceMax);
      }
      if (search && search.trim()) {
        params.set('search', search.trim());
      }
      if (newFilters.sort && newFilters.sort !== 'recommended') {
        params.set('sort', newFilters.sort);
      }
      if (page > 1) {
        params.set('page', page.toString());
      }

      const queryString = params.toString();
      startTransition(() => {
        router.push(`/products${queryString ? `?${queryString}` : ''}`, { scroll: false });
      });
    },
    [router]
  );

  // 4. Fetch Products from API
  const fetchProductsList = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const minVal = activeFilters.priceMin ? parseFloat(activeFilters.priceMin) : undefined;
      const maxVal = activeFilters.priceMax ? parseFloat(activeFilters.priceMax) : undefined;

      const res = await getProducts({
        category: activeFilters.category === 'all' ? undefined : activeFilters.category,
        priceMode: activeFilters.priceMode === 'all' ? undefined : activeFilters.priceMode,
        priceMin: minVal,
        priceMax: maxVal,
        search: searchQuery || undefined,
        sort: activeFilters.sort,
        page: currentPage,
        limit: 12,
      });

      const responseData = res.data;
      const items = Array.isArray(responseData)
        ? responseData
        : responseData.items || [];
      const total = Array.isArray(responseData)
        ? responseData.length
        : responseData.total ?? items.length;
      const totalP = Array.isArray(responseData)
        ? 1
        : responseData.totalPages ?? 1;

      setProducts(items);
      setTotalItems(total);
      setTotalPages(totalP);
    } catch (err) {
      console.error('Error fetching catalogue:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters, searchQuery, currentPage]);

  // Load Initial Settings & Categories
  useEffect(() => {
    async function loadMeta() {
      const [settingsRes, categoriesRes] = await Promise.allSettled([
        getSiteSettings(),
        getCategories(),
      ]);
      if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value.data);
      if (categoriesRes.status === 'fulfilled') setCategories(categoriesRes.value.data);
    }
    loadMeta();
  }, []);

  // Trigger Fetch when Filters, Search or Page Change
  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  // Handle Category Chip Click
  const handleSelectCategory = (catSlug: string) => {
    const updated = { ...activeFilters, category: catSlug };
    setActiveFilters(updated);
    setCurrentPage(1);
    updateUrlParams(updated, searchQuery, 1);
  };

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    updateUrlParams(activeFilters, searchQuery, 1);
  };

  // Handle Filter Drawer Apply
  const handleApplyFilters = (newFilters: FilterState) => {
    setActiveFilters(newFilters);
    setCurrentPage(1);
    updateUrlParams(newFilters, searchQuery, 1);
  };

  // Handle Reset / Clear All Filters
  const handleResetFilters = () => {
    const reset = {
      category: 'all',
      priceMode: 'all',
      priceMin: '',
      priceMax: '',
      sort: 'recommended',
    };
    setActiveFilters(reset);
    setSearchQuery('');
    setCurrentPage(1);
    updateUrlParams(reset, '', 1);
  };

  // Handle Page Change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateUrlParams(activeFilters, searchQuery, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate active filter count for badge
  const activeFilterCount =
    (activeFilters.category !== 'all' ? 1 : 0) +
    (activeFilters.priceMode !== 'all' ? 1 : 0) +
    (activeFilters.priceMin ? 1 : 0) +
    (activeFilters.priceMax ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#201A15] relative pb-20 sm:pb-0">
      {/* 1. Header Navigation */}
      <SiteHeader settings={settings} />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6">
        {/* 2. Breadcrumbs */}
        <Breadcrumb items={[{ label: 'Products' }]} />

        {/* 3. Page Title & Clarification of Price Modes */}
        <div className="pt-2 pb-6 border-b border-[#E5DDD1]">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#201A15] tracking-tight">
            Furniture & Carpentry Products
          </h1>
          <p className="text-xs sm:text-sm text-[#5C4D41] mt-2 max-w-3xl leading-relaxed">
            Browse genuine workshop-crafted furniture pieces in seasoned teakwood and engineered ply.
            Items marked with fixed prices are available for direct order; bespoke wardrobes,
            kitchens, and custom-dimension mandirs require an itemized quotation based on your room
            measurements.
          </p>
        </div>

        {/* 4. Search and Mobile Filter Bar */}
        <div className="py-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Field */}
          <form onSubmit={handleSearchSubmit} role="search" className="relative flex-1 max-w-lg">
            <label htmlFor="catalogue-search-input" className="sr-only">
              Search catalogue products
            </label>
            <input
              id="catalogue-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, wood species, or SKU..."
              className="w-full bg-white border border-[#E5DDD1] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-[#201A15] placeholder-[#8C7E72] focus:border-[#2D6A4F] focus:ring-1 focus:ring-[#2D6A4F] shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#8C7E72] absolute left-3.5 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  updateUrlParams(activeFilters, '', 1);
                }}
                className="absolute right-3 top-3 text-[#8C7E72] hover:text-[#201A15]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Controls: Mobile Filter Button & Sort Dropdown */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E5DDD1] rounded-xl text-xs font-semibold text-[#201A15] hover:bg-[#FAF7F2] focus-accessible shadow-2xs"
              aria-label={`Open filters. ${activeFilterCount} active filters`}
            >
              <SlidersHorizontal className="w-4 h-4 text-[#6B3F23]" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#1E4D2B] text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Sort Control */}
            <div className="flex items-center gap-2 bg-white border border-[#E5DDD1] rounded-xl px-3 py-2 shadow-2xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#6B3F23] shrink-0" />
              <label htmlFor="sort-select" className="sr-only">
                Sort Products
              </label>
              <select
                id="sort-select"
                value={activeFilters.sort}
                onChange={(e) => {
                  const updated = { ...activeFilters, sort: e.target.value };
                  setActiveFilters(updated);
                  updateUrlParams(updated, searchQuery, 1);
                }}
                className="text-xs font-semibold bg-transparent text-[#201A15] focus:outline-none cursor-pointer"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="newest">Sort: Newest</option>
                <option value="name_asc">Sort: Name (A to Z)</option>
                <option value="price_asc">Sort: Price (Low to High)</option>
                <option value="price_desc">Sort: Price (High to Low)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 5. Category Chips */}
        <div className="pb-6">
          <CategoryChips
            categories={categories}
            activeCategory={activeFilters.category}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* 6. Main 2-Column Grid: Desktop Filters Sidebar + Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar (Col 1-3) */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24" aria-label="Filters">
            <FilterDrawer
              isOpen={false}
              onClose={() => {}}
              categories={categories}
              currentFilters={activeFilters}
              onApplyFilters={handleApplyFilters}
              onResetFilters={handleResetFilters}
              isMobileOnly={false}
            />
          </aside>

          {/* Products Content Area (Col 4-12) */}
          <div className="lg:col-span-9 flex flex-col">
            {/* Result Count and Active Filters Summary */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DDD1] mb-6 text-xs text-[#5C4D41]">
              <span id="catalogue-result-count">
                Showing <strong className="text-[#201A15]">{totalItems}</strong> products
              </span>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-[#1E4D2B] hover:text-[#2D6A4F] underline underline-offset-2 focus-accessible"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* State A: Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <LoadingSkeleton variant="card" count={6} />
              </div>
            )}

            {/* State B: Error State */}
            {!isLoading && isError && (
              <ErrorState
                title="Unable to load product catalogue"
                message="There was an issue communicating with the workshop database. Please retry to restore your filtered list."
                onRetry={fetchProductsList}
              />
            )}

            {/* State C: Empty State */}
            {!isLoading && !isError && products.length === 0 && (
              <EmptyState
                title="No products matched your criteria"
                message="Try clearing your filters, adjusting your price range, or submitting a custom furniture request for made-to-measure woodwork."
                actionText="Clear all filters"
                onActionClick={handleResetFilters}
              />
            )}

            {/* State D: Products Grid */}
            {!isLoading && !isError && products.length > 0 && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                id="products-grid"
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* 7. Made-to-Measure Custom Work Banner */}
            <CustomWorkBanner />

            {/* 8. Pagination */}
            {!isLoading && !isError && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                limit={12}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>

      {/* 9. Mobile Slide-Over Filter Drawer Modal */}
      <FilterDrawer
        isOpen={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        categories={categories}
        currentFilters={activeFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isMobileOnly={true}
      />

      {/* 10. Footer and Mobile Action Bar */}
      <SiteFooter settings={settings} />
      <MobileContactAction contact={settings.contact} />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF7F2] p-8 text-center">Loading catalogue...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
