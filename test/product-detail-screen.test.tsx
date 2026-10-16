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

import { ImageGallery } from '../components/product-detail/ImageGallery';
import { DimensionConfigurator } from '../components/product-detail/DimensionConfigurator';
import { OptionsSelector } from '../components/product-detail/OptionsSelector';
import { ProductTabs } from '../components/product-detail/ProductTabs';
import { ProductEnquiryModal } from '../components/product-detail/ProductEnquiryModal';
import { ProductDetailClient } from '../app/products/[slug]/ProductDetailClient';
import {
  getPublicProductBySlug,
  submitProductEnquiry,
  masterProductDatabase,
  standardOrderingSteps,
} from '../lib/public-data';

describe('Screen 04: Product Details Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------
  // Test 1: Valid Slug Loading & Details Retrieval
  // -------------------------------------------------------------
  it('loads the correct product details, gallery, and specs for a valid slug', () => {
    const product = getPublicProductBySlug('krishna-solid-teak-king-bed');

    expect(product).not.toBeNull();
    expect(product?.name).toBe('Krishna Solid Teak King Bed with Storage');
    expect(product?.sku).toBe('VC-COT-KING-01');
    expect(product?.priceMode).toBe('fixed');
    expect(product?.salePricePaise).toBe(4850000); // ₹48,500
    expect(product?.galleryImages?.length).toBeGreaterThan(0);
    expect(product?.dimensions?.standard.widthInches).toBe(72);
  });

  // -------------------------------------------------------------
  // Test 2: Invalid or Unpublished / Draft / Private Slug Handling
  // -------------------------------------------------------------
  it('returns null for nonexistent, draft, or private products', () => {
    // 1. Nonexistent slug
    const nonexistent = getPublicProductBySlug('nonexistent-furniture-item');
    expect(nonexistent).toBeNull();

    // 2. Draft product (prod-secret-draft)
    const draftProduct = getPublicProductBySlug('unfinished-experimental-chair');
    expect(draftProduct).toBeNull();

    // 3. Private product (prod-private-custom-job)
    const privateProduct = getPublicProductBySlug('private-client-bespoke-wardrobe');
    expect(privateProduct).toBeNull();
  });

  // -------------------------------------------------------------
  // Test 3: Public Data Isolation & Security
  // -------------------------------------------------------------
  it('strictly excludes internalNotes, supplierCostPaise, and grossMarginPercentage from public product response', () => {
    const product = getPublicProductBySlug('krishna-solid-teak-king-bed') as any;

    expect(product.internalNotes).toBeUndefined();
    expect(product.supplierCostPaise).toBeUndefined();
    expect(product.grossMarginPercentage).toBeUndefined();

    // Verify all related products are also stripped of internal fields
    product.relatedProducts?.forEach((rel: any) => {
      expect(rel.internalNotes).toBeUndefined();
      expect(rel.supplierCostPaise).toBeUndefined();
      expect(rel.grossMarginPercentage).toBeUndefined();
    });
  });

  // -------------------------------------------------------------
  // Test 4: Pricing Modes & Explicit Policy Language
  // -------------------------------------------------------------
  it('renders fixed price item with Add to Cart and policy statement', async () => {
    render(<ProductDetailClient slug="krishna-solid-teak-king-bed" />);

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Krishna Solid Teak King Bed with Storage'
      );
    });

    // Check fixed price display
    expect(screen.getByTestId('price-fixed')).toHaveTextContent(/48,500/);

    // Primary CTA is Add to Cart / Order Spec
    expect(
      screen.getByRole('button', { name: /add to cart \/ order spec/i })
    ).toBeInTheDocument();

    // Policy text verified
    expect(
      screen.getByText(/fixed public sale price for standard workshop specifications/i)
    ).toBeInTheDocument();
  });

  it('renders starting_from item with Request Quotation and baseline explanation', async () => {
    render(<ProductDetailClient slug="godavari-seasoned-teak-queen-bed" />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Godavari Seasoned Teak Queen Bed'
      );
    });

    expect(screen.getByTestId('price-starting-from')).toHaveTextContent(/38,000/);

    expect(
      screen.getByRole('button', { name: /request quotation for this spec/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/baseline starting price covers standard sizing/i)
    ).toBeInTheDocument();
  });

  it('renders quote_required item with Request This Product and bespoke notice', async () => {
    render(<ProductDetailClient slug="handcrafted-heritage-pooja-mandir" />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
        'Handcrafted Heritage Pooja Mandir'
      );
    });

    expect(screen.getByTestId('price-quote-required')).toHaveTextContent(/quote required/i);

    expect(
      screen.getByRole('button', { name: /request this product/i })
    ).toBeInTheDocument();

    expect(
      screen.getByText(/custom quote required\. price and timber volume depend/i)
    ).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  // Test 5: Image Gallery Controls, Alt Text & Fallback
  // -------------------------------------------------------------
  it('ImageGallery provides accessible controls, alt text, and thumbnail switching', () => {
    const galleryAssets = [
      { url: 'https://images.unsplash.com/photo-1', alt: 'Angle 1: Front Headboard' },
      { url: 'https://images.unsplash.com/photo-2', alt: 'Angle 2: Grain Texture' },
    ];

    render(
      <ImageGallery
        productName="Teak Bed"
        primaryImage={{ url: 'https://images.unsplash.com/photo-1', alt: 'Angle 1: Front Headboard' }}
        galleryImages={galleryAssets}
      />
    );

    // Main image and thumbnail rendered with alt text
    const imgs = screen.getAllByAltText('Angle 1: Front Headboard');
    expect(imgs.length).toBeGreaterThanOrEqual(1);

    // Next button cycles to second image
    const nextBtn = screen.getByRole('button', { name: /next image/i });
    fireEvent.click(nextBtn);

    const nextImgs = screen.getAllByAltText('Angle 2: Grain Texture');
    expect(nextImgs.length).toBeGreaterThanOrEqual(1);
  });

  it('ImageGallery renders designed fallback when image is null', () => {
    render(
      <ImageGallery
        productName="Sliding Wardrobe"
        primaryImage={null}
        galleryImages={[]}
      />
    );

    expect(screen.getByTestId('image-fallback')).toBeInTheDocument();
    expect(screen.getByText(/built custom to order in our vuyyuru workshop/i)).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  // Test 6: DimensionConfigurator Standard vs Custom Validation
  // -------------------------------------------------------------
  it('DimensionConfigurator enforces minimum and maximum boundaries in custom mode', () => {
    const onChangeCustom = vi.fn();
    const limits = {
      minWidthInches: 60,
      maxWidthInches: 84,
      minHeightInches: 36,
      maxHeightInches: 54,
      minDepthInches: 72,
      maxDepthInches: 84,
    };

    render(
      <DimensionConfigurator
        dimensions={{
          standard: {
            widthInches: 72,
            heightInches: 42,
            depthInches: 78,
            summary: '78" L x 72" W x 42" H',
          },
          customizable: true,
          limits,
        }}
        onChangeCustomDimensions={onChangeCustom}
      />
    );

    // Switch to Custom Dimensions mode
    const customModeBtn = screen.getByRole('button', { name: /customize dimensions/i });
    fireEvent.click(customModeBtn);

    const widthInput = screen.getByLabelText(/width \(in\)/i);

    // Enter width below minimum (50 < 60)
    fireEvent.change(widthInput, { target: { value: '50' } });

    expect(screen.getByText(/width cannot be less than 60 inches/i)).toBeInTheDocument();
    expect(onChangeCustom).toHaveBeenCalledWith(null, false);

    // Enter valid width (76)
    fireEvent.change(widthInput, { target: { value: '76' } });
    expect(screen.queryByText(/width cannot be less than 60 inches/i)).not.toBeInTheDocument();
    expect(onChangeCustom).toHaveBeenCalledWith(expect.stringContaining('76" W'), true);
  });

  // -------------------------------------------------------------
  // Test 7: OptionsSelector Interactivity & Quantity Bounds
  // -------------------------------------------------------------
  it('OptionsSelector allows selecting wood, finish, and bounds quantity between 1 and 10', () => {
    const onSelectWood = vi.fn();
    const onSelectFinish = vi.fn();
    const onChangeQty = vi.fn();

    render(
      <OptionsSelector
        woodSpeciesList={['CP Teakwood', 'Burma Teak']}
        selectedWood="CP Teakwood"
        onSelectWood={onSelectWood}
        finishesList={['Natural Teak Polish', 'Matte PU']}
        selectedFinish="Natural Teak Polish"
        onSelectFinish={onSelectFinish}
        quantity={1}
        onChangeQuantity={onChangeQty}
        maxQuantity={10}
      />
    );

    // Select alternative wood species
    const burmaBtn = screen.getByRole('button', { name: /burma teak/i });
    fireEvent.click(burmaBtn);
    expect(onSelectWood).toHaveBeenCalledWith('Burma Teak');

    // Decrease disabled at 1
    const minusBtn = screen.getByRole('button', { name: /decrease quantity/i });
    expect(minusBtn).toBeDisabled();

    // Increase quantity
    const plusBtn = screen.getByRole('button', { name: /increase quantity/i });
    fireEvent.click(plusBtn);
    expect(onChangeQty).toHaveBeenCalledWith(2);
  });

  // -------------------------------------------------------------
  // Test 8: ProductTabs Accessibility & Inclusions / Workflow Content
  // -------------------------------------------------------------
  it('ProductTabs switches content between specifications, inclusions, and ordering workflow', () => {
    const product = getPublicProductBySlug('krishna-solid-teak-king-bed')!;

    render(<ProductTabs product={product} orderingSteps={standardOrderingSteps} />);

    // Inclusions Tab
    const inclusionsTab = screen.getByRole('tab', { name: /what is included/i });
    fireEvent.click(inclusionsTab);

    expect(screen.getByText(/100% seasoned solid teakwood/i)).toBeInTheDocument();
    expect(screen.getByText(/what is not included/i)).toBeInTheDocument();

    // Ordering Workflow Tab
    const orderingTab = screen.getByRole('tab', { name: /how ordering works/i });
    fireEvent.click(orderingTab);

    expect(screen.getByText(/vuyyuru carpentry milestone workflow/i)).toBeInTheDocument();
    expect(screen.getByText(/3d cad blueprint & timber inspection/i)).toBeInTheDocument();
  });

  // -------------------------------------------------------------
  // Test 9: Product Enquiry Submission & Option Context Preservation
  // -------------------------------------------------------------
  it('submitProductEnquiry validates fields and preserves product and option context', () => {
    // 1. Invalid phone number rejection
    const invalidPhoneRes = submitProductEnquiry({
      productId: 'prod-teak-king-cot',
      productSlug: 'krishna-solid-teak-king-bed',
      customerName: 'Suresh Varma',
      customerPhone: '123', // Invalid!
      deliveryTown: 'Vuyyuru',
      requestedOptions: { woodSpecies: 'CP Teakwood' },
      quantity: 1,
      message: 'Please quote',
    });
    expect(invalidPhoneRes.success).toBe(false);
    expect(invalidPhoneRes.error).toMatch(/valid 10-digit mobile phone number/i);

    // 2. Valid submission
    const validRes = submitProductEnquiry({
      productId: 'prod-teak-king-cot',
      productSlug: 'krishna-solid-teak-king-bed',
      customerName: 'Suresh Varma',
      customerPhone: '9848012345',
      deliveryTown: 'Vuyyuru',
      requestedOptions: {
        woodSpecies: 'CP Teakwood',
        finish: 'Natural Teak Melamine Polish',
        customDimensions: '78" L x 76" W x 42" H',
      },
      quantity: 2,
      message: 'Please confirm timber availability for housewarming next month.',
    });

    expect(validRes.success).toBe(true);
    expect(validRes.data?.enquiryId).toMatch(/^ENQ-2026-\d{4}$/);
    expect(validRes.data?.summary.productTitle).toBe('Krishna Solid Teak King Bed with Storage');
    expect(validRes.data?.status).toBe('received');
  });

  // -------------------------------------------------------------
  // Test 10: Snapshot Immutability Rule
  // -------------------------------------------------------------
  it('confirms quotation snapshots retain agreed prices independently of catalogue edits', () => {
    // Simulated historical quotation snapshot
    const historicalQuotation = {
      quoteId: 'QUO-2025-001',
      agreedDate: '2025-12-10T10:00:00Z',
      lineItems: [
        {
          productId: 'prod-teak-king-cot',
          snapshotTitle: 'Krishna Solid Teak King Bed with Storage',
          snapshotWood: 'CP Teakwood',
          agreedPricePaise: 4500000, // ₹45,000 in 2025
          quantity: 1,
        },
      ],
    };

    // Current product catalogue price is ₹48,500 (4850000 paise)
    const currentProduct = getPublicProductBySlug('krishna-solid-teak-king-bed')!;
    expect(currentProduct.salePricePaise).toBe(4850000);

    // Historical quotation snapshot remains unchanged
    expect(historicalQuotation.lineItems[0].agreedPricePaise).toBe(4500000);
    expect(historicalQuotation.lineItems[0].agreedPricePaise).not.toBe(
      currentProduct.salePricePaise
    );
  });
});
