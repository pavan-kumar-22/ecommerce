import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProjectsClient } from '../app/projects/ProjectsClient';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectBeforeAfterViewer } from '../components/projects/ProjectBeforeAfterViewer';
import { ProjectDetailClient } from '../app/projects/[slug]/ProjectDetailClient';
import {
  masterProjectsDatabase,
  queryPublicProjects,
  getPublicProjectBySlug,
} from '../lib/public-data';
import { PublicProject } from '../types/api';

// Mock next/navigation
const mockReplace = vi.fn();
let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

describe('Screen 07: Portfolio & Projects Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('1. displays only published projects with approved photo permission', async () => {
    render(<ProjectsClient />);

    await waitFor(() => {
      expect(screen.getByText('Our Carpentry Work')).toBeInTheDocument();
    });

    // Check that approved projects are visible
    expect(
      screen.getByText('Custom Teakwood Living & Mandir Suite')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Modular BWP Marine Ply Kitchen & Acrylic Pantry')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Solid Teak Entrance Architrave & Panel Doors')
    ).toBeInTheDocument();

    // Verify privacy: Draft and denied projects must NEVER appear
    expect(
      screen.queryByText('Private Custom Dressing Room Wardrobe (Draft Scope)')
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Executive Conference Room Table (Consent Denied)')
    ).not.toBeInTheDocument();
  });

  it('2. queryPublicProjects enforces publication and privacy filtering at data level', () => {
    const res = queryPublicProjects({ limit: 50 });

    // Ensure all returned items are published with approved photo consent
    res.items.forEach((proj) => {
      expect(proj.publicationStatus).toBe('published');
      expect(proj.photoPermissionStatus).toBe('approved');
      expect(proj.photoPermissionGranted).toBe(true);
    });

    // Verify unapproved drafts or denied items in master database are excluded
    const draftInDb = masterProjectsDatabase.find((p) => p.id === 'proj-private-draft');
    expect(draftInDb).toBeDefined();
    expect(res.items.some((p) => p.id === 'proj-private-draft')).toBe(false);

    const deniedInDb = masterProjectsDatabase.find((p) => p.id === 'proj-private-denied');
    expect(deniedInDb).toBeDefined();
    expect(res.items.some((p) => p.id === 'proj-private-denied')).toBe(false);
  });

  it('3. filters projects when a category tab is clicked', async () => {
    render(<ProjectsClient />);

    await waitFor(() => {
      expect(screen.getByText('Custom Teakwood Living & Mandir Suite')).toBeInTheDocument();
    });

    // Click 'Doors & Frames' tab
    const doorsTab = screen.getByRole('tab', { name: /Doors & Frames/i });
    fireEvent.click(doorsTab);

    await waitFor(() => {
      // Solid Teak Doors should be present
      expect(
        screen.getByText('Solid Teak Entrance Architrave & Panel Doors')
      ).toBeInTheDocument();
      // Kitchen should not be present in doors filter
      expect(
        screen.queryByText('Modular BWP Marine Ply Kitchen & Acrylic Pantry')
      ).not.toBeInTheDocument();
    });

    expect(mockReplace).toHaveBeenCalledWith(
      expect.stringContaining('category=doors'),
      expect.anything()
    );
  });

  it('4. filters projects dynamically via search query', async () => {
    render(<ProjectsClient />);

    await waitFor(() => {
      expect(screen.getByText('Our Carpentry Work')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search wood, location, type.../i);
    fireEvent.change(searchInput, { target: { value: 'Rosewood' } });

    await waitFor(() => {
      expect(
        screen.getByText('Antique Rosewood Diwan Restoration & Structural Joinery')
      ).toBeInTheDocument();
      expect(
        screen.queryByText('Modular BWP Marine Ply Kitchen & Acrylic Pantry')
      ).not.toBeInTheDocument();
    });
  });

  it('5. ProjectCard renders meaningful alt text, location, and timber badges', () => {
    const sampleProject: PublicProject = {
      id: 'test-proj',
      title: 'Handcrafted Teak Pooja Mandir',
      slug: 'test-teak-mandir',
      category: 'furniture',
      summary: 'Custom carved temple with brass fittings in Vuyyuru',
      images: [
        {
          url: 'https://images.unsplash.com/test-mandir.jpg',
          alt: 'Handcrafted teakwood mandir with gopuram detail in Vuyyuru',
          kind: 'finished',
        },
      ],
      coverImage: {
        url: 'https://images.unsplash.com/test-mandir.jpg',
        alt: 'Handcrafted teakwood mandir with gopuram detail in Vuyyuru',
      },
      generalArea: 'Vuyyuru Rural',
      location: 'Vuyyuru Rural',
      year: 2026,
      materialsUsed: ['Burma Teak', 'Solid Brass Inlay'],
      publicationStatus: 'published',
      photoPermissionStatus: 'approved',
      photoPermissionGranted: true,
    };

    render(<ProjectCard project={sampleProject} />);

    // Alt text
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute(
      'alt',
      'Handcrafted teakwood mandir with gopuram detail in Vuyyuru'
    );

    // Location
    expect(screen.getByText('Vuyyuru Rural')).toBeInTheDocument();

    // Timber badges
    expect(screen.getByText('Burma Teak')).toBeInTheDocument();
    expect(screen.getByText('Solid Brass Inlay')).toBeInTheDocument();
    expect(screen.getByText('Verified Client Installation')).toBeInTheDocument();
  });

  it('6. Request Similar CTA routes to /custom-furniture with prefilled project reference', () => {
    const sampleProject: PublicProject = {
      id: 'test-proj',
      title: 'Solid Teak Double Entrance Door',
      slug: 'solid-teak-double-entrance-door',
      category: 'doors',
      summary: 'Heavy 45mm solid teak main double doors',
      images: [
        {
          url: 'https://images.unsplash.com/test-door.jpg',
          alt: 'Solid teak door in Guntur',
          kind: 'finished',
        },
      ],
      coverImage: {
        url: 'https://images.unsplash.com/test-door.jpg',
        alt: 'Solid teak door in Guntur',
      },
      generalArea: 'Guntur',
      location: 'Guntur',
      year: 2025,
      materialsUsed: ['Ghana Teak'],
      publicationStatus: 'published',
      photoPermissionStatus: 'approved',
      photoPermissionGranted: true,
    };

    render(<ProjectCard project={sampleProject} />);

    const requestSimilarBtn = screen.getByRole('link', {
      name: /Request similar carpentry based on Solid Teak Double Entrance Door/i,
    });

    expect(requestSimilarBtn).toHaveAttribute(
      'href',
      expect.stringContaining('/custom-furniture?project=solid-teak-double-entrance-door')
    );
    expect(requestSimilarBtn).toHaveAttribute(
      'href',
      expect.stringContaining('category=doors')
    );
  });

  it('7. renders empty state when no projects match the query with filter reset action', async () => {
    render(<ProjectsClient />);

    await waitFor(() => {
      expect(screen.getByText('Our Carpentry Work')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search wood, location, type.../i);
    fireEvent.change(searchInput, { target: { value: 'nonexistentwoodspeciesxyz123' } });

    await waitFor(() => {
      expect(screen.getByTestId('projects-empty-state')).toBeInTheDocument();
      expect(screen.getByText('No projects match your filter')).toBeInTheDocument();
    });

    // Reset filters
    const resetBtn = screen.getByRole('button', { name: /Reset All Filters/i });
    fireEvent.click(resetBtn);

    await waitFor(() => {
      expect(
        screen.getByText('Custom Teakwood Living & Mandir Suite')
      ).toBeInTheDocument();
    });
  });

  it('8. ProjectBeforeAfterViewer toggles between before and after states with explicit consent disclosure', () => {
    const beforeImg = {
      url: 'https://images.unsplash.com/before.jpg',
      alt: 'Antique diwan before restoration with cracked tenons',
      kind: 'before' as const,
    };
    const afterImg = {
      url: 'https://images.unsplash.com/after.jpg',
      alt: 'Restored rosewood diwan with French polish',
      kind: 'after' as const,
    };

    render(
      <ProjectBeforeAfterViewer
        beforeImage={beforeImg}
        afterImage={afterImg}
        projectTitle="Antique Rosewood Diwan"
      />
    );

    // Initial state: After Workshop Joinery is active
    expect(
      screen.getByText('✓ Completed Workshop Finish')
    ).toBeInTheDocument();

    // Toggle to Before Restoration
    const beforeTab = screen.getByRole('tab', { name: /Before Restoration/i });
    fireEvent.click(beforeTab);

    expect(
      screen.getByText('⚠ Initial Condition Prior to Work')
    ).toBeInTheDocument();

    // Verify disclosure
    expect(
      screen.getByText(/Both photos are authentic project captures published with explicit homeowner consent/i)
    ).toBeInTheDocument();
  });

  it('9. ProjectDetailClient renders full project story, materials, and back link', async () => {
    render(<ProjectDetailClient slug="vuyyuru-residence-teak-suite" />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Custom Teakwood Living & Mandir Suite' })
      ).toBeInTheDocument();
    });

    // Scope & Materials
    expect(
      screen.getByText('Burma Teakwood (Grade 1)')
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Workshop pre-fabrication with full mortise-and-tenon structural framing/i)
    ).toBeInTheDocument();

    // Privacy notice
    expect(
      screen.getByText(/To protect client privacy, exact street addresses, telephone records, and private invoices are never published/i)
    ).toBeInTheDocument();

    // CTA
    const requestBtn = screen.getByRole('link', { name: /Request Similar Carpentry/i });
    expect(requestBtn).toHaveAttribute(
      'href',
      expect.stringContaining('/custom-furniture?project=vuyyuru-residence-teak-suite')
    );
  });

  it('10. ProjectDetailClient shows not found / private state for invalid or unapproved slug', async () => {
    // Draft project slug: private-draft-wardrobe
    render(<ProjectDetailClient slug="private-draft-wardrobe" />);

    await waitFor(() => {
      expect(screen.getByText('Project not found or private')).toBeInTheDocument();
    });

    expect(
      screen.getByText(/This project is either unpublished, pending client photography consent, or has been archived/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('link', { name: /Return to Projects Gallery/i })
    ).toHaveAttribute('href', '/projects');
  });
});
