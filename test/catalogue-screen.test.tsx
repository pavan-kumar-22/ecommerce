import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(''),
}));

import { Breadcrumb } from '../components/catalogue/Breadcrumb';
import { CategoryChips } from '../components/catalogue/CategoryChips';
import { PriceDisplay } from '../components/catalogue/PriceDisplay';
import { ProductCard } from '../components/ProductCard';
import { CustomWorkBanner } from '../components/catalogue/CustomWorkBanner';
import { FilterDrawer } from '../components/catalogue/FilterDrawer';
import { Pagination } from '../components/catalogue/Pagination';
import {
  verifiedCategories,
  queryPublicProducts,
  masterProductDatabase,
} from '../lib/public-data';
import { PublicProduct } from '../types/api';

describe('Screen 02: Product Catalogue Acceptance Tests', () => {
  // Test 1: Breadcrumb rendering
  it('renders breadcrumb with working links to Home and current Products page', () => {
    render(<Breadcrumb items={[{ label: 'Products' }]} />);

    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveAttribute('href', '/');

    const productsSegment = screen.getByText('Products');
    expect(productsSegment).toHaveAttribute('aria-current', 'page');
  });

  // Test 2: Category chips update selection
  it('category chips display All Products plus active categories and trigger callback', () => {
    const selectCategoryFn = vi.fn();
    render(
      <CategoryChips
        categories={verifiedCategories}
        activeCategory="beds"
        onSelectCategory={selectCategoryFn}
      />
    );

    expect(screen.getByRole('tab', { name: 'All Products' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Beds & Cots' })).toHaveAttribute('aria-selected', 'true');

    const tablesTab = screen.getByRole('tab', { name: 'Dining & Tables' });
    fireEvent.click(tablesTab);
    expect(selectCategoryFn).toHaveBeenCalledWith('tables');
  });

  // Test 3: Price mode rendering rules (fixed, starting_from, quote_required)
  it('PriceDisplay formats fixed price in INR', () => {
    render(
      <PriceDisplay
        priceMode="fixed"
        salePricePaise={4850000} // 48,500 rupees
      />
    );
    expect(screen.getByTestId('price-fixed')).toHaveTextContent(/48,500/);
  });

  it('PriceDisplay formats starting_from price with prefix', () => {
    render(
      <PriceDisplay
        priceMode="starting_from"
        startingPricePaise={3800000} // 38,000 rupees
      />
    );
    const container = screen.getByTestId('price-starting-from');
    expect(container).toHaveTextContent(/Starting from/i);
    expect(container).toHaveTextContent(/38,000/);
  });

  it('PriceDisplay hides prices and shows Quote Required for bespoke items', () => {
    render(<PriceDisplay priceMode="quote_required" />);
    const container = screen.getByTestId('price-quote-required');
    expect(container).toHaveTextContent(/Quote Required/i);
    expect(container).not.toHaveTextContent(/₹/);
  });

  // Test 4: Image fallback component
  it('ProductCard renders designed fallback when primaryImage is null', () => {
    const productWithoutImage: PublicProduct = {
      id: 'prod-no-img',
      name: 'Custom Sliding Wardrobe',
      slug: 'custom-sliding-wardrobe',
      shortDescription: 'Wardrobe without uploaded photo',
      categoryId: 'cat-wardrobes',
      categorySlug: 'wardrobes',
      categoryName: 'Wardrobes & Closets',
      primaryImage: null, // Null image
      priceMode: 'quote_required',
      startingPrice: null,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      availabilityLabel: 'Made to Order',
    };

    render(<ProductCard product={productWithoutImage} />);

    // Fallback container rendered
    expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
    expect(screen.getByText('Crafted in Workshop')).toBeInTheDocument();
  });

  // Test 5: Catalogue Filter Engine - Public Visibility & Status Rules
  it('never returns draft or private products to public visitors', () => {
    const result = queryPublicProducts({});

    // Verify secret draft is excluded
    const draftFound = result.items.find((p) => p.slug === 'unfinished-experimental-chair');
    expect(draftFound).toBeUndefined();

    // Verify private custom job is excluded
    const privateFound = result.items.find((p) => p.slug === 'private-client-bespoke-wardrobe');
    expect(privateFound).toBeUndefined();

    // All returned items must be active and public
    result.items.forEach((item) => {
      expect(item.status).toBe('active');
      expect(item.visibility).toBe('public');
    });
  });

  // Test 6: Security & Privacy - Internal cost, notes, or margins are never exposed
  it('strips internalNotes, supplierCostPaise, and grossMarginPercentage from public records', () => {
    const result = queryPublicProducts({});

    result.items.forEach((item: any) => {
      expect(item.internalNotes).toBeUndefined();
      expect(item.supplierCostPaise).toBeUndefined();
      expect(item.grossMarginPercentage).toBeUndefined();
    });
  });

  // Test 7: Filter Engine - Category, Price Mode, and Search Filtering
  it('filters products correctly by category, price mode, and search keyword', () => {
    // 1. Category Filter
    const beds = queryPublicProducts({ category: 'beds' });
    expect(beds.items.length).toBeGreaterThan(0);
    beds.items.forEach((p) => expect(p.categorySlug).toBe('beds'));

    // 2. Price Mode Filter
    const quoteOnly = queryPublicProducts({ priceMode: 'quote_required' });
    expect(quoteOnly.items.length).toBeGreaterThan(0);
    quoteOnly.items.forEach((p) => expect(p.priceMode).toBe('quote_required'));

    // 3. Search Filter
    const searchTeak = queryPublicProducts({ search: 'Godavari' });
    expect(searchTeak.items.some((p) => p.name.includes('Godavari'))).toBe(true);
  });

  // Test 8: Custom Work Banner CTA
  it('CustomWorkBanner links to /custom-furniture', () => {
    render(<CustomWorkBanner />);

    const cta = screen.getByRole('link', { name: /request custom furniture/i });
    expect(cta).toHaveAttribute('href', '/custom-furniture');
  });

  // Test 9: Pagination controls
  it('Pagination renders current page, page buttons, and handles navigation', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        totalItems={30}
        limit={12}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByText(/showing/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextBtn);
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  // Test 10: FilterDrawer validation
  it('FilterDrawer displays error when minimum price exceeds maximum price', () => {
    const applyFn = vi.fn();
    render(
      <FilterDrawer
        isOpen={true}
        onClose={() => {}}
        categories={verifiedCategories}
        currentFilters={{
          category: 'all',
          priceMode: 'all',
          priceMin: '50000',
          priceMax: '30000', // Invalid: min > max
          sort: 'recommended',
        }}
        onApplyFilters={applyFn}
        onResetFilters={() => {}}
        isMobileOnly={false}
      />
    );

    const applyBtn = screen.getByRole('button', { name: /apply filters/i });
    fireEvent.click(applyBtn);

    expect(
      screen.getByText('Minimum price cannot be greater than maximum price')
    ).toBeInTheDocument();
    expect(applyFn).not.toHaveBeenCalled();
  });
});
