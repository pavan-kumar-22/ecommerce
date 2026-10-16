import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(''),
}));

import { ServiceCard } from '../components/services/ServiceCard';
import { ServiceProcessSection } from '../components/services/ServiceProcessSection';
import { ServiceFaqSection } from '../components/services/ServiceFaqSection';
import { ServicesFilterTabs } from '../components/services/ServicesFilterTabs';
import { ServicesClient } from '../app/services/ServicesClient';
import {
  queryPublicServices,
  getPublicServiceBySlug,
  getPublicServiceFaqs,
  masterServicesDatabase,
} from '../lib/public-data';

describe('Screen 06: Services Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------
  // Test 1: Only Active Services are Returned (Gating Drafts)
  // -------------------------------------------------------------
  it('filters out draft and archived services from public queries', () => {
    const allServices = queryPublicServices();

    // Verify all returned services are strictly active
    expect(allServices.length).toBeGreaterThan(0);
    allServices.forEach((service) => {
      expect(service.status).toBe('active');
    });

    // Verify the internal draft service (marine-hull-draft) is NOT present
    const draftInPublic = allServices.find((s) => s.slug === 'marine-hull-draft');
    expect(draftInPublic).toBeUndefined();

    // Direct slug query on draft service returns null
    const draftDirect = getPublicServiceBySlug('marine-hull-draft');
    expect(draftDirect).toBeNull();
  });

  // -------------------------------------------------------------
  // Test 2: Service Card Pricing Modes & Indicative Disclaimers
  // -------------------------------------------------------------
  it('clearly distinguishes indicative estimates from inspection-required and quote workflows', () => {
    // 1. Repair service with indicative pricing
    const repairService = masterServicesDatabase.find((s) => s.slug === 'repairs')!;
    const { rerender } = render(<ServiceCard service={repairService} />);

    expect(screen.getByText('Indicative Estimate')).toBeDefined();
    expect(screen.getByText(/Typical Labour & Survey Range:/i)).toBeDefined();
    expect(screen.getByText(/₹450 – ₹2,500/i)).toBeDefined();
    expect(
      screen.getByText(/Indicative estimate; hardware, timber, and travel affect final quotation/i)
    ).toBeDefined();

    // 2. Complex modular kitchen with inspection_required
    const kitchenService = masterServicesDatabase.find((s) => s.slug === 'modular-kitchens')!;
    rerender(<ServiceCard service={kitchenService} />);

    expect(screen.getByText('Laser Inspection & Quote Required')).toBeDefined();
    expect(
      screen.getByText(/Itemized quote prepared after on-site laser measurements/i)
    ).toBeDefined();
    // Complex service must not display a misleading automated fixed price
    expect(screen.queryByText(/Typical Labour & Survey Range:/i)).toBeNull();
  });

  // -------------------------------------------------------------
  // Test 3: Service CTAs Pass Correct Service Context to Contact Screen
  // -------------------------------------------------------------
  it('links service cards to /contact with prefilled service slug', () => {
    const doorService = masterServicesDatabase.find((s) => s.slug === 'doors-and-frames')!;
    render(<ServiceCard service={doorService} />);

    const ctaLink = screen.getByRole('link', { name: /Request Solid Teak Main Entrance Doors/i });
    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute('href')).toBe('/contact?service=doors-and-frames');
  });

  // -------------------------------------------------------------
  // Test 4: Bespoke Custom Furniture Routes to Custom Furniture Form
  // -------------------------------------------------------------
  it('links bespoke custom furniture fabrication to /custom-furniture', () => {
    const customService = masterServicesDatabase.find((s) => s.slug === 'custom-furniture')!;
    render(<ServiceCard service={customService} />);

    const ctaLink = screen.getByRole('link', { name: /Request Bespoke Solid Teakwood Furniture/i });
    expect(ctaLink).toBeDefined();
    expect(ctaLink.getAttribute('href')).toBe('/custom-furniture');
  });

  // -------------------------------------------------------------
  // Test 5: Scope Notes & Exclusions Toggle
  // -------------------------------------------------------------
  it('renders scope notes and toggles exclusions properly', () => {
    const wardrobeService = masterServicesDatabase.find((s) => s.slug === 'modular-wardrobes')!;
    render(<ServiceCard service={wardrobeService} />);

    // Scope heading
    expect(screen.getByText('What This Service Covers:')).toBeDefined();

    // Scope items
    expect(screen.getByText(/Laser site survey to detect wall undulations/i)).toBeDefined();

    // Expand scope
    const expandBtn = screen.getByText(/\+2 more scope details/i);
    fireEvent.click(expandBtn);

    // Exclusions section should now be visible
    expect(screen.getByText('Scope Exclusions:')).toBeDefined();
    expect(screen.getByText(/Room electrical wiring overhaul/i)).toBeDefined();
  });

  // -------------------------------------------------------------
  // Test 6: Process Section Renders 5 Traceable Stages
  // -------------------------------------------------------------
  it('renders the 5-stage craftsmanship process without automated instant price promises', () => {
    render(<ServiceProcessSection />);

    expect(screen.getByText('How Our Carpentry Process Works')).toBeDefined();
    expect(screen.getByText('Share Details')).toBeDefined();
    expect(screen.getByText('Artisan Review')).toBeDefined();
    expect(screen.getByText('Laser Site Survey')).toBeDefined();
    expect(screen.getByText('Written Quotation')).toBeDefined();
    expect(screen.getByText('Workshop Joinery')).toBeDefined();

    // Policy banner
    expect(
      screen.getByText(/We never promise instant automated price guarantees/i)
    ).toBeDefined();
  });

  // -------------------------------------------------------------
  // Test 7: Approved Service FAQs Accordion
  // -------------------------------------------------------------
  it('renders approved FAQs and expands answers on click', () => {
    const faqs = getPublicServiceFaqs();
    expect(faqs.length).toBeGreaterThanOrEqual(6);

    render(<ServiceFaqSection faqs={faqs} />);

    // First FAQ should be expanded by default
    expect(screen.getByText(faqs[0].question)).toBeDefined();
    expect(screen.getByText(faqs[0].answer)).toBeDefined();

    // Second FAQ
    const faq2Btn = screen.getByText(faqs[1].question);
    fireEvent.click(faq2Btn);

    expect(screen.getByText(faqs[1].answer)).toBeDefined();
  });

  // -------------------------------------------------------------
  // Test 8: Filter Tabs & Full Page Rendering
  // -------------------------------------------------------------
  it('renders the full services page with filter tabs and regional service areas', async () => {
    render(<ServicesClient />);

    // Page title
    expect(
      screen.getByText('From Minor Repairs to Architectural Woodwork')
    ).toBeDefined();

    // Emergency notice
    expect(screen.getByText(/Service Scheduling Notice:/i)).toBeDefined();

    // Filter tabs
    expect(screen.getByText('All Services')).toBeDefined();
    expect(screen.getByText('Repairs & Maintenance')).toBeDefined();

    // Regional service area tiers
    await waitFor(() => {
      expect(screen.getByText('Where We Provide On-Site Carpentry')).toBeDefined();
      expect(screen.getByText(/Tier 1 · Primary Hub/i)).toBeDefined();
      expect(screen.getByText(/Vuyyuru Town & Rural Mandal/i)).toBeDefined();
      expect(screen.getByText(/Tier 2 · Urban Corridor/i)).toBeDefined();
      expect(screen.getByText(/Vijayawada, Guntur & Tenali/i)).toBeDefined();
    });
  });

  // -------------------------------------------------------------
  // Test 9: Category Filtering Interaction
  // -------------------------------------------------------------
  it('filters services when a category tab is clicked', async () => {
    render(<ServicesClient />);

    // Click Repairs filter tab
    const repairTab = screen.getByRole('button', { name: /Repairs & Maintenance/i });
    fireEvent.click(repairTab);

    // Verify repairs card is visible
    await waitFor(() => {
      expect(screen.getByText('Carpentry Repairs & Hardware Maintenance')).toBeDefined();
    });
  });

  // -------------------------------------------------------------
  // Test 10: Nonexistent Service Slug Retrieval
  // -------------------------------------------------------------
  it('returns null and does not throw for invalid or nonexistent service slugs', () => {
    const invalidService = getPublicServiceBySlug('invalid-service-xyz');
    expect(invalidService).toBeNull();
  });
});
