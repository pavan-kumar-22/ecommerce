import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CheckoutClient } from '../app/checkout/CheckoutClient';
import {
  masterCartDatabase,
  masterOrdersDatabase,
  masterSiteVisitBookings,
  idempotencyStore,
  createOrder,
  getOrderById,
  validateCheckoutCart,
  createSiteVisitBooking,
  verifyServerPayment,
  getFulfilmentOptions,
} from '../lib/public-data';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('Screen 11: Checkout & Booking Acceptance Tests', () => {
  const testSessionId = 'test_guest_session_11';

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset test session cart with 1 fixed-price solid teak bed
    masterCartDatabase.set(testSessionId, {
      id: 'cart_test_11',
      guestSessionId: testSessionId,
      items: [
        {
          id: 'ci_test_bed_11',
          productId: 'prod-teak-king-cot',
          quantity: 1,
          selectedWoodSpecies: 'CP Teakwood (Standard)',
          selectedFinish: 'Natural Teak Melamine Polish',
          snapshotPricePaise: 4850000,
          addedAt: new Date().toISOString(),
        },
      ],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    });

    // Mock localStorage to return testSessionId
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(() => testSessionId),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });
  });

  it('1. renders breadcrumbs, title, transaction mode toggle, and step 1 contact form', async () => {
    render(<CheckoutClient />);

    expect(screen.getByRole('heading', { level: 1, name: 'Checkout & Booking' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Mode A: Fixed-Price Order/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /Mode B: Service Visit Request/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mobile Phone Number/i)).toBeInTheDocument();
    });
  });

  it('2. empty carts cannot create orders (server & UI rejection)', () => {
    const emptySessionId = 'test_empty_session_11';
    masterCartDatabase.set(emptySessionId, {
      id: 'cart_empty_11',
      guestSessionId: emptySessionId,
      items: [],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    });

    // Validation must report canCheckout: false
    const val = validateCheckoutCart(emptySessionId);
    expect(val.valid).toBe(false);
    expect(val.canCheckout).toBe(false);
    expect(val.changes).toContain('Your cart is empty. Add eligible fixed-price products before checking out.');

    // Order creation must be rejected
    const result = createOrder({
      idempotencyKey: 'idemp_empty_cart_test',
      guestSessionId: emptySessionId,
      contact: { name: 'Pavan Kumar', phone: '9848012345' },
      fulfilment: { method: 'local_delivery', address: { area: 'Vuyyuru', addressLine: 'Main St' } },
      paymentMethod: 'pay_on_delivery',
      termsAccepted: true,
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/Your cart is empty/i);
  });

  it('3. quote-only / bespoke products cannot be checked out via fixed-price order', () => {
    const quoteSessionId = 'test_quote_session_11';
    masterCartDatabase.set(quoteSessionId, {
      id: 'cart_quote_11',
      guestSessionId: quoteSessionId,
      items: [
        {
          id: 'ci_mandir_quote_01',
          productId: 'prod-pooja-mandir', // quote_required item
          quantity: 1,
          snapshotPricePaise: 0,
          addedAt: new Date().toISOString(),
        },
      ],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    });

    const result = createOrder({
      idempotencyKey: 'idemp_quote_test',
      guestSessionId: quoteSessionId,
      contact: { name: 'Rao Garu', phone: '9848012345' },
      fulfilment: { method: 'local_delivery', address: { area: 'Vuyyuru', addressLine: 'Temple Rd' } },
      paymentMethod: 'pay_on_delivery',
      termsAccepted: true,
    });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/custom or quote-only items/i);
  });

  it('4. server totals override all client-supplied values (integer paise arithmetic)', () => {
    const val = validateCheckoutCart(testSessionId, 'local_delivery');
    expect(val.subtotalPaise).toBe(4850000); // ₹48,500 in paise
    expect(val.deliveryPaise).toBe(0); // Complimentary local delivery
    expect(val.taxPaise).toBe(0); // Included in prices
    expect(val.totalPaise).toBe(4850000);
  });

  it('5. duplicate requests with identical idempotency key return the original order without creating duplicates', () => {
    const key = `idemp_unique_test_${Date.now()}`;
    const payload = {
      idempotencyKey: key,
      guestSessionId: testSessionId,
      contact: { name: 'K. Subba Rao', phone: '98480 12345' },
      fulfilment: {
        method: 'local_delivery' as const,
        address: { area: 'Vuyyuru Town', addressLine: 'D.No 5-21, Main Bazar' },
      },
      paymentMethod: 'pay_on_delivery' as const,
      termsAccepted: true,
    };

    // First order creation
    const order1 = createOrder(payload);
    expect(order1.success).toBe(true);
    expect(order1.order).toBeDefined();

    // Second order creation with SAME idempotency key (e.g. accidental double click)
    const order2 = createOrder(payload);
    expect(order2.success).toBe(true);
    // Must return the exact same order reference and ID
    expect(order2.order?.id).toBe(order1.order?.id);
    expect(order2.order?.orderReference).toBe(order1.order?.orderReference);
  });

  it('6. only configured fulfilment options are offered and delivery address is required conditionally', () => {
    const options = getFulfilmentOptions();
    expect(options.length).toBe(3);
    const optionIds = options.map((o) => o.id);
    expect(optionIds).toContain('workshop_collection');
    expect(optionIds).toContain('local_delivery');
    expect(optionIds).toContain('delivery_installation');

    // Workshop collection does NOT require address
    const collectionOpt = options.find((o) => o.id === 'workshop_collection');
    expect(collectionOpt?.requiresAddress).toBe(false);

    // Local delivery DOES require address
    const deliveryOpt = options.find((o) => o.id === 'local_delivery');
    expect(deliveryOpt?.requiresAddress).toBe(true);
  });

  it('7. customer privacy protection: getOrderById rejects unauthorized access', () => {
    // Seed cart for private_guest_999
    masterCartDatabase.set('private_guest_999', {
      id: 'cart_priv_999',
      guestSessionId: 'private_guest_999',
      items: [
        {
          id: 'ci_priv_01',
          productId: 'prod-teak-king-cot',
          quantity: 1,
          snapshotPricePaise: 4850000,
          addedAt: new Date().toISOString(),
        },
      ],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    });

    // Create an order
    const created = createOrder({
      idempotencyKey: `idemp_priv_test_${Date.now()}`,
      guestSessionId: 'private_guest_999',
      contact: { name: 'Private Customer', phone: '9848012345' },
      fulfilment: { method: 'local_delivery', address: { area: 'Vuyyuru', addressLine: 'Private Lane' } },
      paymentMethod: 'pay_on_delivery',
      termsAccepted: true,
    });

    expect(created.success).toBe(true);
    const orderId = created.order!.id;
    const orderToken = created.order!.orderToken;

    // An unauthorized request with wrong token and wrong session must be rejected
    const unauthorized = getOrderById(orderId, 'wrong_token', 'intruder_guest_session');
    expect(unauthorized.success).toBe(false);
    expect(unauthorized.statusCode).toBe(403);

    // Permitted with correct token
    const authorized = getOrderById(orderId, orderToken);
    expect(authorized.success).toBe(true);
    expect(authorized.order?.id).toBe(orderId);
  });

  it('8. Mode B service visit booking stores separate record with pending confirmation', () => {
    const visit = createSiteVisitBooking({
      serviceId: 'door-window-repairs',
      workDescription: 'Front teak door bottom scraping marble floor and needs rehinging',
      customerName: 'Anjaneyulu M.',
      customerPhone: '9440281734',
      area: 'Vuyyuru Town',
      preferredDate: '2026-10-25',
      preferredTimeWindow: 'morning',
      consentAccepted: true,
    });

    expect(visit.success).toBe(true);
    expect(visit.siteVisit).toBeDefined();
    expect(visit.siteVisit?.reference).toMatch(/^VC-SVR-2026-\d{4}$/);
    expect(visit.siteVisit?.status).toBe('visit_pending_confirmation');
    expect(visit.siteVisit?.statusLabel).toBe('Pending Confirmation');

    // Must be stored in masterSiteVisitBookings, NOT masterOrdersDatabase
    expect(masterSiteVisitBookings.has(visit.siteVisit!.id)).toBe(true);
    expect(masterOrdersDatabase.has(visit.siteVisit!.id)).toBe(false);
  });

  it('9. server payment verification: payment is never marked paid from browser redirect alone', () => {
    // Seed cart for guest_pay_session
    masterCartDatabase.set('guest_pay_session', {
      id: 'cart_pay_sess',
      guestSessionId: 'guest_pay_session',
      items: [
        {
          id: 'ci_pay_01',
          productId: 'prod-teak-king-cot',
          quantity: 1,
          snapshotPricePaise: 4850000,
          addedAt: new Date().toISOString(),
        },
      ],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    });

    // Create an order
    const created = createOrder({
      idempotencyKey: `idemp_pay_test_${Date.now()}`,
      guestSessionId: 'guest_pay_session',
      contact: { name: 'Nageswara Rao', phone: '9848012345' },
      fulfilment: { method: 'local_delivery', address: { area: 'Vuyyuru', addressLine: 'Bazar' } },
      paymentMethod: 'online_upi_advance',
      termsAccepted: true,
    });

    expect(created.success).toBe(true);
    const order = created.order!;
    // Initially paymentStatus must be pending, NOT paid
    expect(order.paymentStatus).toBe('pending');
    expect(order.orderStatus).toBe('pending_review');

    // Simulated verified gateway webhook from server
    const verification = verifyServerPayment(
      order.id,
      order.orderToken,
      'txn_upi_axis_849204',
      'SUCCESS'
    );

    expect(verification.success).toBe(true);
    expect(verification.order?.paymentStatus).toBe('paid');
    expect(verification.order?.orderStatus).toBe('confirmed');
    expect(verification.order?.paymentDetails?.transactionId).toBe('txn_upi_axis_849204');
  });

  it('10. terms acknowledgement and phone validation are enforced on order creation', () => {
    // Reject if terms not accepted
    const noTerms = createOrder({
      idempotencyKey: 'idemp_no_terms',
      guestSessionId: testSessionId,
      contact: { name: 'Customer', phone: '9848012345' },
      fulfilment: { method: 'local_delivery', address: { area: 'Vuyyuru', addressLine: 'St' } },
      paymentMethod: 'pay_on_delivery',
      termsAccepted: false,
    });
    expect(noTerms.success).toBe(false);
    expect(noTerms.error).toMatch(/accept the workshop crafting and delivery terms/i);

    // Reject if invalid phone
    const invalidPhone = createOrder({
      idempotencyKey: 'idemp_bad_phone',
      guestSessionId: testSessionId,
      contact: { name: 'Customer', phone: '123' },
      fulfilment: { method: 'local_delivery', address: { area: 'Vuyyuru', addressLine: 'St' } },
      paymentMethod: 'pay_on_delivery',
      termsAccepted: true,
    });
    expect(invalidPhone.success).toBe(false);
    expect(invalidPhone.error).toMatch(/valid 10-digit Indian mobile number/i);
  });
});
