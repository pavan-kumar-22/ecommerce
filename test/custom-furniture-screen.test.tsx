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

import { StepIndicator } from '../components/custom-furniture/StepIndicator';
import { Step1Requirements, Step1FormData } from '../components/custom-furniture/Step1Requirements';
import { Step2Dimensions, Step2FormData } from '../components/custom-furniture/Step2Dimensions';
import { Step3SitePhotos, Step3FormData } from '../components/custom-furniture/Step3SitePhotos';
import { Step4ContactConsent, Step4FormData } from '../components/custom-furniture/Step4ContactConsent';
import { EnquiryConfirmation } from '../components/custom-furniture/EnquiryConfirmation';
import { CustomFurnitureClient } from '../app/custom-furniture/CustomFurnitureClient';
import { submitCustomFurnitureEnquiry } from '../lib/public-data';
import { CustomFurnitureEnquiryPayload } from '../types/api';

describe('Screen 05: Custom Furniture Request Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // -------------------------------------------------------------
  // Test 1: Step 1 Validation & Behavior
  // -------------------------------------------------------------
  it('validates Step 1 required fields and conditionally renders custom item field for "other"', () => {
    const handleNext = vi.fn();
    const handleChange = vi.fn();

    const initialData: Step1FormData = {
      furnitureType: '',
      description: '',
      quantity: 1,
    };

    const { rerender } = render(
      <Step1Requirements
        data={initialData}
        onChange={handleChange}
        onNext={handleNext}
        errors={{ furnitureType: 'Please select a furniture type.' }}
      />
    );

    // Check error message
    expect(screen.getByText('Please select a furniture type.')).toBeDefined();

    // Select "Other Custom Joinery"
    rerender(
      <Step1Requirements
        data={{ ...initialData, furnitureType: 'other' }}
        onChange={handleChange}
        onNext={handleNext}
        errors={{}}
      />
    );

    // Conditional text input for "other" item must be present
    expect(screen.getByLabelText(/Specify Custom Furniture Item/i)).toBeDefined();

    // Verify quantity stepper bounds
    expect(screen.getByText('Max 20 units per request')).toBeDefined();
  });

  // -------------------------------------------------------------
  // Test 2: Step 2 Dimension Units (MM) & Provisional Rule
  // -------------------------------------------------------------
  it('clearly displays millimetre units and dimension rule disclaimer', () => {
    const handleNext = vi.fn();
    const handleBack = vi.fn();
    const handleChange = vi.fn();

    const data: Step2FormData = {
      confidence: 'approximate',
      features: ['drawers'],
    };

    render(
      <Step2Dimensions
        data={data}
        onChange={handleChange}
        onNext={handleNext}
        onBack={handleBack}
        errors={{}}
      />
    );

    // Millimetre labels and conversion hints
    expect(screen.getAllByText('mm').length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText(/Quick conversion: 1 foot ≈ 305 mm/i)).toBeDefined();

    // Dimension rule callout banner
    expect(screen.getByText(/Customer-entered dimensions are initial estimates/i)).toBeDefined();
    expect(screen.getByText(/Quotations remain provisional until final measurements/i)).toBeDefined();

    // Confidence options
    expect(screen.getByText('Approximate estimate')).toBeDefined();
    expect(screen.getByText('Accurately measured')).toBeDefined();
    expect(screen.getByText('Not sure — Please advise')).toBeDefined();
  });

  // -------------------------------------------------------------
  // Test 3: Step 3 Site Details & Conditional Date/Time Slots
  // -------------------------------------------------------------
  it('enforces site locality and conditionally shows visit availability preferences', () => {
    const handleNext = vi.fn();
    const handleBack = vi.fn();
    const handleChange = vi.fn();

    const data: Step3FormData = {
      area: '',
      visitRequested: 'no',
    };

    const { rerender } = render(
      <Step3SitePhotos
        data={data}
        onChange={handleChange}
        onNext={handleNext}
        onBack={handleBack}
        errors={{ area: 'Please enter your locality' }}
      />
    );

    // Check locality error and confidential note
    expect(screen.getByText('Please enter your locality')).toBeDefined();
    expect(screen.getByText(/Private & Confidential/i)).toBeDefined();

    // Site visit date picker should not be visible when visitRequested is 'no'
    expect(screen.queryByLabelText(/Preferred Date/i)).toBeNull();

    // When visitRequested is 'yes', date and time slot inputs should appear
    rerender(
      <Step3SitePhotos
        data={{ ...data, visitRequested: 'yes' }}
        onChange={handleChange}
        onNext={handleNext}
        onBack={handleBack}
        errors={{}}
      />
    );

    expect(screen.getByLabelText(/Preferred Date/i)).toBeDefined();
    expect(screen.getByLabelText(/Preferred Time Slot/i)).toBeDefined();
  });

  // -------------------------------------------------------------
  // Test 4: Step 4 Contact Details & Separate Marketing Opt-in
  // -------------------------------------------------------------
  it('enforces mandatory enquiry consent while keeping marketing opt-in separate and unchecked', () => {
    const handleSubmit = vi.fn();
    const handleBack = vi.fn();
    const handleEditStep = vi.fn();
    const handleChange = vi.fn();

    const data: Step4FormData = {
      name: 'Ramesh Varma',
      phone: '9440281734',
      whatsappAvailable: true,
      preferredContactMethod: 'whatsapp',
      consent: false,
      marketingOptIn: false,
    };

    const step1Data: Step1FormData = {
      furnitureType: 'wardrobe',
      description: '4-door modular wardrobe',
      quantity: 1,
    };

    const step2Data: Step2FormData = {
      confidence: 'approximate',
      widthMm: 1800,
      heightMm: 2100,
      depthMm: 600,
    };

    const step3Data: Step3FormData = {
      area: 'Vuyyuru Town',
      visitRequested: 'yes',
    };

    render(
      <Step4ContactConsent
        data={data}
        step1Data={step1Data}
        step2Data={step2Data}
        step3Data={step3Data}
        onChange={handleChange}
        onEditStep={handleEditStep}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isSubmitting={false}
        submitError={null}
        errors={{ consent: 'Consent is required' }}
      />
    );

    // Review Summary verification
    expect(screen.getByText('Project Scope Summary')).toBeDefined();
    expect(screen.getByText('WARDROBE')).toBeDefined();
    expect(screen.getByText(/W: 1800mm × H: 2100mm × D: 600mm/i)).toBeDefined();
    expect(screen.getByText('Vuyyuru Town')).toBeDefined();

    // Consent checkbox check
    const consentCheckbox = screen.getByLabelText(/Required Consent:/i) as HTMLInputElement;
    expect(consentCheckbox.checked).toBe(false);

    // Marketing opt-in checkbox check (must be unchecked by default)
    const marketingCheckbox = screen.getByLabelText(/Optional Workshop Updates:/i) as HTMLInputElement;
    expect(marketingCheckbox.checked).toBe(false);
  });

  // -------------------------------------------------------------
  // Test 5: Server-Side Reference & Status in Confirmation Screen
  // -------------------------------------------------------------
  it('renders server-generated reference code, Received status, and provisional disclaimer', () => {
    const handleReset = vi.fn();

    const mockResponse = {
      enquiryId: 'enq_abc123',
      reference: 'VC-REQ-2026-7842',
      status: 'received' as const,
      message: 'Your request has been received.',
      receivedAt: '2026-10-16T10:00:00.000Z',
      summary: {
        furnitureType: 'Solid Teak Dining Table',
        quantity: 1,
        area: 'Vuyyuru Town',
        siteVisitRequested: 'yes' as const,
        preferredContactMethod: 'whatsapp' as const,
      },
    };

    render(<EnquiryConfirmation response={mockResponse} onReset={handleReset} />);

    // Reference code
    expect(screen.getByText('VC-REQ-2026-7842')).toBeDefined();
    expect(screen.getByText(/Status: Received/i)).toBeDefined();

    // Workflow next steps
    expect(screen.getByText('Artisan Review')).toBeDefined();
    expect(screen.getByText('Measurement Call')).toBeDefined();
    expect(screen.getByText('Written Quotation')).toBeDefined();

    // Business disclaimer
    expect(
      screen.getByText(/This enquiry does not constitute an accepted order, confirmed site visit, or guaranteed final price/i)
    ).toBeDefined();

    // WhatsApp action button
    expect(screen.getByText(/Chat on WhatsApp \(VC-REQ-2026-7842\)/i)).toBeDefined();
  });

  // -------------------------------------------------------------
  // Test 6: Backend Validation Engine: submitCustomFurnitureEnquiry
  // -------------------------------------------------------------
  it('correctly validates payloads and generates unique VC-REQ-2026-XXXX references', () => {
    // 1. Missing requirements
    const res1 = submitCustomFurnitureEnquiry({} as any);
    expect(res1.success).toBe(false);
    expect(res1.error).toContain('Project requirements');

    // 2. Short description (<10 chars)
    const res2 = submitCustomFurnitureEnquiry({
      type: 'custom_furniture',
      requirements: {
        furnitureType: 'bed',
        description: 'short',
        quantity: 1,
        dimensions: { confidence: 'approximate' },
      },
      site: { area: 'Vuyyuru', visitRequested: 'no' },
      customer: { name: 'Ramesh', phone: '9440281734', whatsappAvailable: true, preferredContactMethod: 'whatsapp' },
      consent: { contactForThisEnquiry: true, marketingOptIn: false, privacyNoticeVersion: 'v2026.1' },
    });
    expect(res2.success).toBe(false);
    expect(res2.error).toContain('minimum 10 characters');

    // 3. Invalid phone number
    const res3 = submitCustomFurnitureEnquiry({
      type: 'custom_furniture',
      requirements: {
        furnitureType: 'bed',
        description: 'Solid teak king size cot with storage hydraulic lift',
        quantity: 1,
        dimensions: { confidence: 'approximate' },
      },
      site: { area: 'Vuyyuru', visitRequested: 'no' },
      customer: { name: 'Ramesh', phone: '123', whatsappAvailable: true, preferredContactMethod: 'whatsapp' },
      consent: { contactForThisEnquiry: true, marketingOptIn: false, privacyNoticeVersion: 'v2026.1' },
    });
    expect(res3.success).toBe(false);
    expect(res3.error).toContain('10-digit Indian mobile number');

    // 4. Missing consent
    const res4 = submitCustomFurnitureEnquiry({
      type: 'custom_furniture',
      requirements: {
        furnitureType: 'bed',
        description: 'Solid teak king size cot with storage hydraulic lift',
        quantity: 1,
        dimensions: { confidence: 'approximate' },
      },
      site: { area: 'Vuyyuru', visitRequested: 'no' },
      customer: { name: 'Ramesh', phone: '9440281734', whatsappAvailable: true, preferredContactMethod: 'whatsapp' },
      consent: { contactForThisEnquiry: false, marketingOptIn: false, privacyNoticeVersion: 'v2026.1' },
    });
    expect(res4.success).toBe(false);
    expect(res4.error).toContain('consent to Vuyyuru Carpentry');

    // 5. Valid guest payload
    const res5 = submitCustomFurnitureEnquiry({
      type: 'custom_furniture',
      requirements: {
        furnitureType: 'wardrobe',
        description: 'Fitted 4-door wardrobe in seasoned CP Teak with Blum runners',
        quantity: 1,
        dimensions: { widthMm: 1800, heightMm: 2100, depthMm: 600, confidence: 'approximate' },
      },
      site: { area: 'Benz Circle, Vijayawada', visitRequested: 'yes' },
      customer: { name: 'Srinivas Rao', phone: '9848012345', whatsappAvailable: true, preferredContactMethod: 'whatsapp' },
      consent: { contactForThisEnquiry: true, marketingOptIn: false, privacyNoticeVersion: 'v2026.1' },
    });

    expect(res5.success).toBe(true);
    expect(res5.data).toBeDefined();
    expect(res5.data?.reference).toMatch(/^VC-REQ-2026-\d{4}$/);
    expect(res5.data?.status).toBe('received');
    expect(res5.data?.summary.area).toBe('Benz Circle, Vijayawada');
  });

  // -------------------------------------------------------------
  // Test 7: Full Wizard Navigation & State Preservation
  // -------------------------------------------------------------
  it('renders Step 1 initially and preserves entered values when navigating between steps', async () => {
    render(<CustomFurnitureClient />);

    // Step 1 title
    expect(screen.getByText('What do you want to make?')).toBeDefined();

    // Select Bed
    const bedButton = screen.getByText('Bed / King Cot');
    fireEvent.click(bedButton);

    // Enter description
    const descInput = screen.getByPlaceholderText(/Explain the intended purpose/i);
    fireEvent.change(descInput, {
      target: { value: 'Custom king cot made from seasoned Burma teak with headboard cushioning' },
    });

    // Click Continue
    const continueBtn = screen.getByText('Continue to Dimensions');
    fireEvent.click(continueBtn);

    // Now on Step 2
    await waitFor(() => {
      expect(screen.getByText('Dimensions and Timber Preferences')).toBeDefined();
    });

    // Enter width in mm
    const widthInput = screen.getByPlaceholderText('e.g. 1800');
    fireEvent.change(widthInput, { target: { value: '1900' } });

    // Click Back
    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);

    // Back on Step 1: verify description was preserved!
    await waitFor(() => {
      expect(screen.getByText('What do you want to make?')).toBeDefined();
    });

    const preservedDesc = screen.getByPlaceholderText(/Explain the intended purpose/i) as HTMLTextAreaElement;
    expect(preservedDesc.value).toContain('seasoned Burma teak');
  });
});
