import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/navigation
const mockPush = vi.fn();
let mockSearchParams = new URLSearchParams('');

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

import { ServiceResultCard } from '../components/search/ServiceResultCard';
import { SearchResultTabs } from '../components/search/SearchResultTabs';
import { NoResultsPanel } from '../components/search/NoResultsPanel';
import { RecentSearches } from '../components/search/RecentSearches';
import {
  queryUnifiedSearch,
  searchableServicesDatabase,
  masterProductDatabase,
} from '../lib/public-data';

describe('Screen 03: Search Results Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  // -------------------------------------------------------------
  // Test 1: URL Parsing & Truncation
  // -------------------------------------------------------------
  it('trims whitespace and enforces maximum length of 100 characters', () => {
    const overlyLong = '   solid teakwood king cot with hydraulic storage and high quality finish ' + 'a'.repeat(80) + '   ';
    const result = queryUnifiedSearch({ q: overlyLong });

    expect(result.query.length).toBeLessThanOrEqual(100);
    expect(result.query.startsWith(' ')).toBe(false);
    expect(result.query.endsWith(' ')).toBe(false);
  });

  // -------------------------------------------------------------
  // Test 2: Blank / Empty Query Handling
  // -------------------------------------------------------------
  it('handles blank queries gracefully without running unrestricted query', () => {
    const resultEmpty = queryUnifiedSearch({ q: '   ' });

    expect(resultEmpty.query).toBe('');
    expect(resultEmpty.items).toEqual([]);
    expect(resultEmpty.total).toBe(0);
    // Suggestions are provided for guidance
    expect(resultEmpty.suggestions.length).toBeGreaterThan(0);
  });

  // -------------------------------------------------------------
  // Test 3: Special Characters & Non-English / XSS Safety
  // -------------------------------------------------------------
  it('safely handles special characters and XSS attempts without error', () => {
    const maliciousQuery = '<script>alert("xss")</script> & "teak"';
    const result = queryUnifiedSearch({ q: maliciousQuery });

    expect(result.query).toBe(maliciousQuery);
    // Safe execution without thrown error
    expect(Array.isArray(result.items)).toBe(true);
  });

  // -------------------------------------------------------------
  // Test 4: Search Ranking - Title Match Ahead of Description Match
  // -------------------------------------------------------------
  it('ranks exact product title matches ahead of broad description matches', () => {
    const result = queryUnifiedSearch({ q: 'Amaravati 6-Seater Solid Wood Dining Set' });

    expect(result.items.length).toBeGreaterThan(0);
    // Top result must be the exact title match
    expect(result.items[0].title).toBe('Amaravati 6-Seater Solid Wood Dining Set');
    expect(result.items[0].kind).toBe('product');
  });

  // -------------------------------------------------------------
  // Test 5: Public-Only Search Results & Privacy Isolation
  // -------------------------------------------------------------
  it('strictly excludes draft and private items from search results', () => {
    // Search for text present in draft and private records
    const resultDraft = queryUnifiedSearch({ q: 'Experimental Chair' });
    expect(resultDraft.items.some((i) => i.slug === 'unfinished-experimental-chair')).toBe(false);

    const resultPrivate = queryUnifiedSearch({ q: 'Private Client' });
    expect(resultPrivate.items.some((i) => i.slug === 'private-client-bespoke-wardrobe')).toBe(false);

    // Verify all returned items have kind and no internal fields
    const allResults = queryUnifiedSearch({ q: 'teak' });
    allResults.items.forEach((item: any) => {
      expect(item.internalNotes).toBeUndefined();
      expect(item.supplierCostPaise).toBeUndefined();
      expect(item.grossMarginPercentage).toBeUndefined();
    });
  });

  // -------------------------------------------------------------
  // Test 6: Result-Type Tabs Filtering (All, Products, Services)
  // -------------------------------------------------------------
  it('filters results by requested type (products vs services vs all)', () => {
    const searchBoth = queryUnifiedSearch({ q: 'teak', type: 'all' });
    const productItems = searchBoth.items.filter((i) => i.kind === 'product');
    const serviceItems = searchBoth.items.filter((i) => i.kind === 'service');

    expect(productItems.length).toBeGreaterThan(0);
    expect(serviceItems.length).toBeGreaterThan(0);

    // Filter type = 'products'
    const productsOnly = queryUnifiedSearch({ q: 'teak', type: 'products' });
    expect(productsOnly.items.every((i) => i.kind === 'product')).toBe(true);

    // Filter type = 'services'
    const servicesOnly = queryUnifiedSearch({ q: 'teak', type: 'services' });
    expect(servicesOnly.items.every((i) => i.kind === 'service')).toBe(true);
  });

  // -------------------------------------------------------------
  // Test 7: SearchResultTabs UI Component
  // -------------------------------------------------------------
  it('SearchResultTabs renders tab buttons with counts and handles tab selection', () => {
    const onSelectTab = vi.fn();
    render(
      <SearchResultTabs
        activeTab="all"
        counts={{ all: 8, products: 5, services: 3 }}
        onSelectTab={onSelectTab}
      />
    );

    const allTab = screen.getByRole('tab', { name: /all results/i });
    expect(allTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('8')).toBeInTheDocument();

    const servicesTab = screen.getByRole('tab', { name: /services & joinery/i });
    expect(servicesTab).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('3')).toBeInTheDocument();

    fireEvent.click(servicesTab);
    expect(onSelectTab).toHaveBeenCalledWith('services');
  });

  // -------------------------------------------------------------
  // Test 8: ServiceResultCard Component & CTA Route
  // -------------------------------------------------------------
  it('ServiceResultCard renders service title, summary, and enquiry link', () => {
    const mockService = {
      kind: 'service' as const,
      id: 'srv-repairs',
      title: 'Carpentry Repairs & Maintenance',
      slug: 'repairs',
      summary: 'Door alignment, lock replacement, and termite inspection.',
      route: '/services#repairs',
      iconName: 'Hammer',
      categoryName: 'Repairs & Maintenance',
    };

    render(<ServiceResultCard service={mockService} />);

    expect(screen.getByText('Carpentry Repairs & Maintenance')).toBeInTheDocument();
    expect(screen.getByText('Door alignment, lock replacement, and termite inspection.')).toBeInTheDocument();

    const links = screen.getAllByRole('link');
    expect(links.some((l) => l.getAttribute('href') === '/services#repairs')).toBe(true);
  });

  // -------------------------------------------------------------
  // Test 9: Zero-Results Panel Guidance & Alternative Actions
  // -------------------------------------------------------------
  it('NoResultsPanel renders safely escaped query, suggestions, and CTA links', () => {
    const onSelectSuggestion = vi.fn();
    render(
      <NoResultsPanel
        query="NonExistentItemXYZ"
        suggestions={['Teak king bed', 'Pooja mandir']}
        onSelectSuggestion={onSelectSuggestion}
      />
    );

    expect(screen.getByText(/no matches found for/i)).toBeInTheDocument();
    expect(screen.getByText('NonExistentItemXYZ')).toBeInTheDocument();

    // Check browse products link
    const browseLink = screen.getByRole('link', { name: /browse full catalogue/i });
    expect(browseLink).toHaveAttribute('href', '/products');

    // Check custom furniture link
    const customLink = screen.getByRole('link', { name: /request made-to-measure design/i });
    expect(customLink).toHaveAttribute('href', '/custom-furniture');

    // Click suggestion
    const suggestionBtn = screen.getByRole('button', { name: 'Teak king bed' });
    fireEvent.click(suggestionBtn);
    expect(onSelectSuggestion).toHaveBeenCalledWith('Teak king bed');
  });

  // -------------------------------------------------------------
  // Test 10: Recent Searches Component (LocalStorage Device-Only)
  // -------------------------------------------------------------
  it('RecentSearches records queries locally, allows deletion and clearing', () => {
    const onSelectSearch = vi.fn();
    localStorage.setItem(
      'vuyyuru_recent_searches',
      JSON.stringify(['Teak cot', 'Dining table'])
    );

    render(<RecentSearches onSelectSearch={onSelectSearch} />);

    expect(screen.getByText('Teak cot')).toBeInTheDocument();
    expect(screen.getByText('Dining table')).toBeInTheDocument();

    // Remove single term
    const removeBtn = screen.getByLabelText('Remove Teak cot from recent searches');
    fireEvent.click(removeBtn);

    expect(screen.queryByText('Teak cot')).not.toBeInTheDocument();
    expect(screen.getByText('Dining table')).toBeInTheDocument();

    // Clear all
    const clearAllBtn = screen.getByRole('button', { name: /clear all/i });
    fireEvent.click(clearAllBtn);

    expect(screen.queryByText('Dining table')).not.toBeInTheDocument();
  });
});
