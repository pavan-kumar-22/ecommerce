import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AboutClient } from '../app/about/AboutClient';
import { AboutStorySection } from '../components/about/AboutStorySection';
import {
  verifiedAboutContent,
  getPublicAboutContent,
} from '../lib/public-data';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('Screen 08: About the Business Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('1. renders approved headline, business introduction, and breadcrumbs', async () => {
    render(<AboutClient />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Local Carpentry Built Around Your Requirements' })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('About the Business')).toBeInTheDocument();
    expect(
      screen.getByText(/Grounded Local Craftsmanship · Vuyyuru, Andhra Pradesh/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/A dedicated joinery workshop serving Vuyyuru town and suitable nearby Andhra areas/i)
    ).toBeInTheDocument();
  });

  it('2. provides working CTAs pointing to /services, /projects, and /custom-furniture', async () => {
    render(<AboutClient />);

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Request a Custom Quote/i })).toHaveAttribute(
        'href',
        '/custom-furniture'
      );
    });

    expect(screen.getByRole('link', { name: /Explore Services/i })).toHaveAttribute(
      'href',
      '/services'
    );
    expect(screen.getByRole('link', { name: /View Real Projects/i })).toHaveAttribute(
      'href',
      '/projects'
    );
  });

  it('3. renders supportable operating values without unsupported claims or fake awards', async () => {
    render(<AboutClient />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Practical Standards, Not Marketing Promises' })
      ).toBeInTheDocument();
    });

    // Verify supportable values
    expect(screen.getByText('Clear Written Scope')).toBeInTheDocument();
    expect(screen.getByText('Realistic Commitments')).toBeInTheDocument();
    expect(screen.getByText('Traceable Timber & Materials')).toBeInTheDocument();
    expect(screen.getByText('Clean Site Respect')).toBeInTheDocument();

    // Verify absence of fabricated claims or fake awards
    expect(screen.queryByText(/Award Winning/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Best Carpenter in India/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/10,000\+ Satisfied Customers/i)).not.toBeInTheDocument();
  });

  it('4. displays 5-stage craftsmanship process and mandatory quotation disclaimer', async () => {
    render(<AboutClient />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'How We Work With You' })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Share Requirements')).toBeInTheDocument();
    expect(screen.getByText('Scope Review')).toBeInTheDocument();
    expect(screen.getByText('Laser Site Survey')).toBeInTheDocument();
    expect(screen.getByText('Written Quotation')).toBeInTheDocument();
    expect(screen.getByText('Workshop Joinery & Fit')).toBeInTheDocument();

    // Verify ordering rule disclaimer
    expect(
      screen.getByText(/Submitting an inquiry or requesting a site visit does not automatically mean a job is accepted/i)
    ).toBeInTheDocument();
  });

  it('5. presents clear service-area policy prioritizing Vuyyuru first', async () => {
    render(<AboutClient />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Vuyyuru First, Andhra Wide for Sizable Projects' })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Vuyyuru Town & Mandal')).toBeInTheDocument();
    expect(screen.getByText('Vijayawada · Guntur · Tenali')).toBeInTheDocument();
    expect(screen.getByText('Coastal Andhra Residences')).toBeInTheDocument();
  });

  it('6. displays verified workshop contact details and direct triggers', async () => {
    render(<AboutClient />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Have a Carpentry Project in Mind?' })
      ).toBeInTheDocument();
    });

    // Check telephone and whatsapp links
    const callBtn = screen.getByRole('link', { name: /Call: \+91 94402 81734/i });
    expect(callBtn).toHaveAttribute('href', 'tel:+91 94402 81734');

    const whatsappBtn = screen.getByRole('link', { name: /Chat on WhatsApp/i });
    expect(whatsappBtn).toHaveAttribute('href', expect.stringContaining('https://wa.me/919440281734'));

    expect(
      screen.getByText(/Main Road, Near Sri Sai Baba Temple, Vuyyuru/i)
    ).toBeInTheDocument();
  });

  it('7. gracefully hides unapproved workshop photos without empty placeholder', () => {
    const sampleParagraphs = ['Test paragraph about woodworking.'];

    // Unapproved photo
    const unapprovedPhoto = {
      url: 'https://images.unsplash.com/test.jpg',
      alt: 'Unapproved test photo',
      approvedForPublication: false,
    };

    const { rerender } = render(
      <AboutStorySection
        paragraphs={sampleParagraphs}
        teamStatement="Small workshop team"
        workshopPhoto={unapprovedPhoto}
      />
    );

    // Unapproved photo must not render an img tag
    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    // Rerender with approved photo
    const approvedPhoto = {
      url: 'https://images.unsplash.com/test.jpg',
      alt: 'Approved test photo',
      approvedForPublication: true,
    };

    rerender(
      <AboutStorySection
        paragraphs={sampleParagraphs}
        teamStatement="Small workshop team"
        workshopPhoto={approvedPhoto}
      />
    );

    expect(screen.getByRole('img')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('alt', 'Approved test photo');
  });

  it('8. getPublicAboutContent enforces privacy by pruning unapproved photos', () => {
    const content = getPublicAboutContent();
    expect(content.businessName).toBe('Vuyyuru Carpentry');
    expect(content.storyParagraphs.length).toBeGreaterThan(0);
    expect(content.values.length).toBe(4);
    expect(content.processSteps.length).toBe(5);

    if (content.workshopPhoto) {
      expect(content.workshopPhoto.approvedForPublication).toBe(true);
    }
  });
});
