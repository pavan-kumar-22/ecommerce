import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

import { SiteHeader } from '../components/SiteHeader';
import { HeroSection } from '../components/HeroSection';
import { ProductCard } from '../components/ProductCard';
import { FeaturedProducts } from '../components/FeaturedProducts';
import { ProjectGalleryPreview } from '../components/ProjectGalleryPreview';
import { ContactStrip } from '../components/ContactStrip';
import { ErrorState } from '../components/ui/ErrorState';
import { EmptyState } from '../components/ui/EmptyState';
import { verifiedSiteSettings, verifiedFeaturedProducts, verifiedFeaturedProjects } from '../lib/public-data';
import { PublicProduct, PublicContactSettings } from '../types/api';

describe('Screen 01: Home - Customer Storefront Acceptance Tests', () => {
  // Test 1: Header renders brand, navigation links, and search input
  it('renders configurable header with business identity and search bar', () => {
    render(<SiteHeader settings={verifiedSiteSettings} />);

    // Business Name
    expect(screen.getByText('Vuyyuru Carpentry')).toBeInTheDocument();

    // Navigation links
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: 'Services' })).toHaveAttribute('href', '/services');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/projects');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact');

    // Account Link
    expect(screen.getByLabelText(/customer account/i)).toHaveAttribute('href', '/account');

    // Search bar input
    const searchInput = screen.getByPlaceholderText('What are you looking for?');
    expect(searchInput).toBeInTheDocument();
  });

  // Test 2: Search submission navigates to /search?q=...
  it('submits search query and navigates to URL-encoded /search?q=...', () => {
    render(<SiteHeader settings={verifiedSiteSettings} />);

    const searchInput = screen.getByPlaceholderText('What are you looking for?');
    fireEvent.change(searchInput, { target: { value: 'Teak Dining Table' } });
    fireEvent.submit(searchInput.closest('form')!);

    expect(mockPush).toHaveBeenCalledWith('/search?q=Teak%20Dining%20Table');
  });

  // Test 3: Hero section validates Primary CTA -> /custom-furniture and Secondary CTA -> /products
  it('hero section routes Primary CTA to /custom-furniture and Secondary CTA to /products', () => {
    render(<HeroSection hero={verifiedSiteSettings.hero} />);

    const primaryCta = screen.getByText('Request a custom quote').closest('a');
    expect(primaryCta).toHaveAttribute('href', '/custom-furniture');

    const secondaryCta = screen.getByText('Browse products').closest('a');
    expect(secondaryCta).toHaveAttribute('href', '/products');

    // Verified service area badge
    expect(screen.getByText(/CUSTOM CARPENTRY · VUYYURU/i)).toBeInTheDocument();

    // Real hero photograph with alt text
    const heroImg = screen.getByAltText(/seasoned teak wood/i);
    expect(heroImg).toBeInTheDocument();
  });

  // Test 4: Pricing Rule - Quote Required vs Fixed Price
  it('hides startingPrice and shows Quote Required when priceMode is quote_required', () => {
    const customMandir: PublicProduct = {
      id: 'prod-mandir',
      name: 'Bespoke Teak Mandir',
      slug: 'bespoke-teak-mandir',
      categorySlug: 'furniture',
      categoryName: 'Custom Furniture',
      primaryImage: { url: 'https://example.com/mandir.jpg', alt: 'Pooja Mandir' },
      woodSpecies: ['Ghana Teak'],
      priceMode: 'quote_required',
      startingPrice: null, // Strictly null per business requirement
      currency: 'INR',
      isCustomizable: true,
    };

    render(<ProductCard product={customMandir} />);

    expect(screen.getByText('Quote Required')).toBeInTheDocument();
    expect(screen.queryByText(/₹/)).not.toBeInTheDocument();
  });

  it('displays real approved starting price in INR when priceMode is fixed', () => {
    const fixedDiningTable: PublicProduct = {
      id: 'prod-table',
      name: 'Amaravati 6-Seater Table',
      slug: 'amaravati-table',
      categorySlug: 'furniture',
      categoryName: 'Custom Furniture',
      primaryImage: { url: 'https://example.com/table.jpg', alt: 'Dining Table' },
      woodSpecies: ['Teakwood'],
      priceMode: 'fixed',
      startingPrice: 56000,
      currency: 'INR',
      isCustomizable: true,
    };

    render(<ProductCard product={fixedDiningTable} />);

    // INR formatted string contains 56,000
    expect(screen.getByText(/56,000/)).toBeInTheDocument();
  });

  // Test 5: Empty state handling
  it('renders EmptyState when no featured products exist', () => {
    render(<FeaturedProducts products={[]} isLoading={false} isError={false} />);

    expect(screen.getByText('No featured products currently listed')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse all products/i })).toHaveAttribute(
      'href',
      '/products'
    );
  });

  // Test 6: Error state handling with recoverable retry trigger
  it('renders ErrorState with retry button when API fails', () => {
    const retryFn = vi.fn();
    render(<ErrorState onRetry={retryFn} />);

    expect(screen.getByText("Couldn't load this section")).toBeInTheDocument();

    const retryBtn = screen.getByRole('button', { name: /retry/i });
    fireEvent.click(retryBtn);
    expect(retryFn).toHaveBeenCalledTimes(1);
  });

  // Test 7: Privacy protection - project photos without permission are omitted
  it('hides project photos that do not have explicit photoPermissionGranted', () => {
    const unapprovedProject = {
      id: 'proj-private',
      title: 'Private Bedroom Wardrobe',
      slug: 'private-wardrobe',
      category: 'Wardrobes',
      location: 'Private Residence',
      year: 2026,
      materialsUsed: ['Teak'],
      coverImage: { url: 'https://example.com/private.jpg', alt: 'Private work' },
      photoPermissionGranted: false, // NOT granted
    };

    render(
      <ProjectGalleryPreview
        projects={[...verifiedFeaturedProjects, unapprovedProject]}
        isLoading={false}
        isError={false}
      />
    );

    expect(screen.queryByText('Private Bedroom Wardrobe')).not.toBeInTheDocument();
  });

  // Test 8: Missing phone number handling - omits call button if unconfigured
  it('omits phone call button if phone is not configured in settings', () => {
    const contactWithoutPhone: PublicContactSettings = {
      phone: null,
      phoneRaw: null,
      whatsapp: '918639731477',
      email: 'test@vuyyuru.in',
      address: verifiedSiteSettings.contact.address,
      workingHours: 'Mon - Sat: 9am - 7pm',
    };

    render(<ContactStrip contact={contactWithoutPhone} />);

    // Phone button must not be rendered
    expect(screen.queryByLabelText(/call/i)).not.toBeInTheDocument();

    // WhatsApp remains available
    expect(screen.getByLabelText(/whatsapp/i)).toBeInTheDocument();
  });
});
