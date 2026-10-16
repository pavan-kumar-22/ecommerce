import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ContactClient } from '../app/contact/ContactClient';
import { ContactForm } from '../components/contact/ContactForm';
import { submitGeneralEnquiry, masterServicesDatabase } from '../lib/public-data';

let mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => mockSearchParams,
}));

// Mock api-client so tests are 100% deterministic in jsdom
vi.mock('../lib/api-client', () => ({
  getPublicServices: vi.fn().resolveValue?.() || vi.fn(() =>
    Promise.resolve({
      data: masterServicesDatabase.filter((s) => s.status === 'active'),
      isFallback: false,
    })
  ),
  submitGeneralEnquiry: vi.fn((payload) => {
    const res = submitGeneralEnquiry(payload);
    if (!res.success) {
      return Promise.reject(new Error(res.error || 'Validation error'));
    }
    return Promise.resolve(res.data);
  }),
}));

describe('Screen 09: Contact & Site-Visit Request Acceptance Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  it('1. renders hero, breadcrumbs, direct contact channels, and scheduling notice', async () => {
    render(<ContactClient />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Tell Us About Your Carpentry Work' })
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Contact & Site Visit')).toBeInTheDocument();
    expect(screen.getByText(/Service Area & Scheduling Notice:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/prioritize jobs in Vuyyuru mandal first/i)
    ).toBeInTheDocument();

    // Check direct contact channel chips with flexible matching
    expect(screen.getByText(/Call:\s*\+91\s*94402\s*81734/i)).toBeInTheDocument();
    expect(screen.getByText(/WhatsApp Consultation/i)).toBeInTheDocument();
  });

  it('2. validates required fields on client submission attempt', async () => {
    render(<ContactClient />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Send Enquiry/i })).toBeInTheDocument();
    });

    // Submit empty form
    fireEvent.click(screen.getByRole('button', { name: /Send Enquiry/i }));

    await waitFor(() => {
      expect(
        screen.getByText('Please enter your full name (minimum 2 characters).')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please enter a valid 10-digit Indian mobile number.')
      ).toBeInTheDocument();
      expect(screen.getByText('Please select a carpentry service.')).toBeInTheDocument();
      expect(
        screen.getByText('Please describe what you need (minimum 10 characters).')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Please enter your town or locality (e.g. Vuyyuru, Benz Circle).')
      ).toBeInTheDocument();
    });
  });

  it('3. validates Indian phone numbers with various formats', async () => {
    render(<ContactClient />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Indian Mobile Number/i)).toBeInTheDocument();
    });

    const phoneInput = screen.getByLabelText(/Indian Mobile Number/i);
    const submitBtn = screen.getByRole('button', { name: /Send Enquiry/i });

    // Invalid phone: too short or starting with invalid digit
    fireEvent.change(phoneInput, { target: { value: '12345' } });
    fireEvent.click(submitBtn);
    expect(
      screen.getByText('Please enter a valid 10-digit Indian mobile number.')
    ).toBeInTheDocument();

    // Valid phone starting with 9
    fireEvent.change(phoneInput, { target: { value: '9848012345' } });
    fireEvent.click(submitBtn);
    expect(
      screen.queryByText('Please enter a valid 10-digit Indian mobile number.')
    ).not.toBeInTheDocument();
  });

  it('4. preselects active service from URL query parameter only if valid', async () => {
    // 1. Valid service query param
    mockSearchParams = new URLSearchParams('service=repairs');
    const { unmount } = render(<ContactClient />);

    await waitFor(() => {
      const select = screen.getByLabelText(/Service Needed/i) as HTMLSelectElement;
      expect(select.value).toBe('repairs');
    });
    unmount();

    // 2. Invalid service query param
    mockSearchParams = new URLSearchParams('service=invalid-service-xyz');
    render(<ContactClient />);

    await waitFor(() => {
      const select = screen.getByLabelText(/Service Needed/i) as HTMLSelectElement;
      expect(select.value).toBe('');
    });
  });

  it('5. conditionally reveals site visit details and makes address required when yes is chosen', async () => {
    render(<ContactClient />);

    await waitFor(() => {
      expect(screen.getByText('3. Site Visit & Measurement Preference')).toBeInTheDocument();
    });

    // Default option is 'advise_me', address input should not exist initially
    expect(
      screen.queryByLabelText(/Full Street Address \/ Landmark for Site Visit/i)
    ).not.toBeInTheDocument();

    // Select "Yes, request a site visit"
    const yesRadio = screen.getByRole('radio', { name: /Yes, request a site visit/i });
    fireEvent.click(yesRadio);

    // Now conditional fields should appear
    expect(
      screen.getByLabelText(/Full Street Address \/ Landmark for Site Visit/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Visit Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Preferred Time Window/i)).toBeInTheDocument();

    // Prominent disclaimer that visit is not a confirmed booking
    expect(
      screen.getByText(/Submitting a date preference does not represent a confirmed appointment/i)
    ).toBeInTheDocument();

    // Submitting without address should trigger validation error
    fireEvent.click(screen.getByRole('button', { name: /Send Enquiry/i }));
    await waitFor(() => {
      expect(
        screen.getByText('Please provide your street address or landmark for the site visit.')
      ).toBeInTheDocument();
    });
  });

  it('6. successfully submits enquiry, returns reference VC-ENQ-2026-XXXX, and displays confirmation', async () => {
    render(<ContactClient />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });

    // Fill form
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Suresh Raju' } });
    fireEvent.change(screen.getByLabelText(/Indian Mobile Number/i), {
      target: { value: '9848022334' },
    });
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'suresh@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/Service Needed/i), { target: { value: 'repairs' } });
    fireEvent.change(screen.getByLabelText(/Describe the Work Needed/i), {
      target: { value: 'Main teak door hinges are loose and sticking to the frame.' },
    });
    fireEvent.change(screen.getByLabelText(/Town \/ Locality/i), {
      target: { value: 'Vuyyuru Katuru Road' },
    });

    // Select WhatsApp as contact method
    const whatsappBtn = screen.getByText('WhatsApp');
    fireEvent.click(whatsappBtn);

    // Submit form
    fireEvent.click(screen.getByRole('button', { name: /Send Enquiry/i }));

    // Confirmation panel should appear
    await waitFor(() => {
      expect(screen.getByTestId('contact-confirmation-panel')).toBeInTheDocument();
    });

    expect(screen.getByText('Thank You! We Have Received Your Request')).toBeInTheDocument();
    expect(screen.getByText(/^VC-ENQ-2026-\d{4}$/)).toBeInTheDocument();
    expect(screen.getByText('Vuyyuru Katuru Road')).toBeInTheDocument();
    expect(
      screen.getByText(/Submitting an enquiry or selecting a date does not constitute an automatically confirmed booking/i)
    ).toBeInTheDocument();

    // Working action buttons
    expect(screen.getByRole('button', { name: /Print \/ Save Copy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Another Request/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Explore All Services/i })).toHaveAttribute(
      'href',
      '/services'
    );
  });

  it('7. preserves entered form data when server error occurs', async () => {
    const activeServices = masterServicesDatabase.filter((s) => s.status === 'active');
    const mockSubmit = vi.fn();

    const { rerender } = render(
      <ContactForm
        services={activeServices}
        initialServiceId="doors"
        onSubmit={mockSubmit}
        isSubmitting={false}
        serverError={null}
      />
    );

    // User fills in form fields
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Narasimha Rao' } });
    fireEvent.change(screen.getByLabelText(/Indian Mobile Number/i), {
      target: { value: '9848099887' },
    });
    fireEvent.change(screen.getByLabelText(/Describe the Work Needed/i), {
      target: { value: 'Need new teakwood main entrance double doors crafted.' },
    });
    fireEvent.change(screen.getByLabelText(/Town \/ Locality/i), {
      target: { value: 'Poranki Vijayawada' },
    });

    // Simulate server returning an error after submission attempt
    rerender(
      <ContactForm
        services={activeServices}
        initialServiceId="doors"
        onSubmit={mockSubmit}
        isSubmitting={false}
        serverError="Workshop server is currently undergoing scheduled maintenance. Please retry."
      />
    );

    // Server error alert should be rendered
    expect(
      screen.getByText(/Workshop server is currently undergoing scheduled maintenance/i)
    ).toBeInTheDocument();

    // Form inputs must remain preserved
    expect((screen.getByLabelText(/Full Name/i) as HTMLInputElement).value).toBe('Narasimha Rao');
    expect((screen.getByLabelText(/Indian Mobile Number/i) as HTMLInputElement).value).toBe(
      '9848099887'
    );
    expect(
      (screen.getByLabelText(/Describe the Work Needed/i) as HTMLTextAreaElement).value
    ).toBe('Need new teakwood main entrance double doors crafted.');
    expect((screen.getByLabelText(/Town \/ Locality/i) as HTMLInputElement).value).toBe(
      'Poranki Vijayawada'
    );
  });

  it('8. backend validation function enforces privacy and date constraints', () => {
    // 1. Consent required
    const unconsented = submitGeneralEnquiry({
      serviceId: 'repairs',
      description: 'Need table repair',
      location: { area: 'Vuyyuru' },
      siteVisit: { requested: 'no' },
      customer: { name: 'Pavan Kumar', phone: '9848011111' },
      consent: { contactForThisEnquiry: false },
    });
    expect(unconsented.success).toBe(false);
    expect(unconsented.error).toContain('consent');

    // 2. Reject past site visit date
    const pastDate = submitGeneralEnquiry({
      serviceId: 'repairs',
      description: 'Need table repair',
      location: { area: 'Vuyyuru' },
      siteVisit: { requested: 'yes', preferredDate: '2020-01-01' },
      customer: { name: 'Pavan Kumar', phone: '9848011111' },
      consent: { contactForThisEnquiry: true },
    });
    expect(pastDate.success).toBe(false);
    expect(pastDate.error).toContain('today or a future date');

    // 3. Privacy protection: private full address not in public summary
    const validWithAddress = submitGeneralEnquiry({
      serviceId: 'repairs',
      description: 'Teak cabinet polish and hinge repair',
      location: { area: 'Vuyyuru', fullAddress: 'Plot 42, Main Bazaar, Private Address' },
      siteVisit: { requested: 'yes', preferredDate: '2026-11-20', preferredTimeWindow: 'morning' },
      customer: { name: 'Pavan Kumar', phone: '+91 98480 11111', preferredContactMethod: 'phone' },
      consent: { contactForThisEnquiry: true },
    });

    expect(validWithAddress.success).toBe(true);
    expect(validWithAddress.data?.reference).toMatch(/^VC-ENQ-2026-\d{4}$/);
    expect(validWithAddress.data?.summary.area).toBe('Vuyyuru');
    // Ensure full address is NOT leaked into the public summary
    expect((validWithAddress.data?.summary as any).fullAddress).toBeUndefined();
  });
});
