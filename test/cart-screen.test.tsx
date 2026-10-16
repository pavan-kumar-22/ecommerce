import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartClient } from '../app/cart/CartClient';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  masterCartDatabase,
  masterProductDatabase,
  revalidateCart,
} from '../lib/public-data';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
}));

describe('Screen 10: Shopping Cart Acceptance Tests', () => {
  const testSessionId = 'test_guest_session_10';

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset test session cart with 1 fixed-price item
    masterCartDatabase.set(testSessionId, {
      id: 'cart_test_10',
      guestSessionId: testSessionId,
      items: [
        {
          id: 'ci_test_bed_01',
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

  it('1. renders cart breadcrumbs, item row with options, and server price summary', async () => {
    render(<CartClient />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Your Shopping Cart' })).toBeInTheDocument();
    });

    expect(screen.getByText('Krishna Solid Teak King Bed with Storage')).toBeInTheDocument();
    expect(screen.getByText(/Timber: CP Teakwood \(Standard\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Finish: Natural Teak Melamine Polish/i)).toBeInTheDocument();
    expect(screen.getByText('Price Summary')).toBeInTheDocument();
    expect(screen.getAllByText(/₹48,500/).length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: /Continue to Checkout/i })).toBeInTheDocument();
  });

  it('2. quantity controls reject zero, negative, and invalid quantities on server', () => {
    // 1. Zero quantity rejected
    const zeroResult = updateCartItem(testSessionId, 'ci_test_bed_01', 0);
    expect(zeroResult.success).toBe(false);
    expect(zeroResult.error).toContain('minimum 1');

    // 2. Negative quantity rejected
    const negResult = updateCartItem(testSessionId, 'ci_test_bed_01', -2);
    expect(negResult.success).toBe(false);
    expect(negResult.error).toContain('minimum 1');

    // 3. Floating point quantity rejected
    const floatResult = updateCartItem(testSessionId, 'ci_test_bed_01', 1.5);
    expect(floatResult.success).toBe(false);
    expect(floatResult.error).toContain('positive whole number');

    // 4. Exceeding max quantity (e.g. 11) rejected
    const maxResult = updateCartItem(testSessionId, 'ci_test_bed_01', 11);
    expect(maxResult.success).toBe(false);
    expect(maxResult.error).toContain('Maximum 10 units');

    // 5. Valid integer quantity (2) accepted
    const validResult = updateCartItem(testSessionId, 'ci_test_bed_01', 2);
    expect(validResult.success).toBe(true);
    expect(validResult.cart?.items[0].quantity).toBe(2);
    expect(validResult.cart?.subtotalPaise).toBe(4850000 * 2);
  });

  it('3. quote-only products cannot be added to purchasable cart', () => {
    // Attempt to add product with priceMode === 'quote_required'
    const quoteOnlyProduct = masterProductDatabase.find((p) => p.priceMode === 'quote_required')!;
    expect(quoteOnlyProduct).toBeDefined();

    const addResult = addItemToCart(testSessionId, {
      productId: quoteOnlyProduct.id,
      quantity: 1,
    });

    expect(addResult.success).toBe(false);
    expect(addResult.error).toContain('Custom made-to-measure furniture requires site inspection');
  });

  it('4. removing the last item displays the empty-cart state', async () => {
    render(<CartClient />);

    await waitFor(() => {
      expect(screen.getByText('Krishna Solid Teak King Bed with Storage')).toBeInTheDocument();
    });

    // Click remove
    const removeBtn = screen.getByRole('button', {
      name: /Remove Krishna Solid Teak King Bed with Storage from cart/i,
    });
    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(screen.getByTestId('cart-empty-state')).toBeInTheDocument();
      expect(screen.getByText('Your Cart is Currently Empty')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /Browse Ready Furniture/i })).toBeInTheDocument();
    });
  });

  it('5. refreshing the page restores the supported cart state via guest session', () => {
    // Session has 1 item
    const cartInitial = getCart(testSessionId);
    expect(cartInitial.items.length).toBe(1);
    expect(cartInitial.items[0].name).toBe('Krishna Solid Teak King Bed with Storage');

    // Subsequent retrieval for the same session ID restores the identical state
    const cartRestored = getCart(testSessionId);
    expect(cartRestored.items.length).toBe(1);
    expect(cartRestored.subtotalPaise).toBe(4850000);
  });

  it('6. client-side price tampering cannot change the server checkout total', () => {
    // Inject a tampered item into session with fake low snapshot price
    masterCartDatabase.set(testSessionId, {
      id: 'cart_tampered',
      guestSessionId: testSessionId,
      items: [
        {
          id: 'ci_tampered_01',
          productId: 'prod-teak-king-cot',
          quantity: 1,
          snapshotPricePaise: 100, // Attacker tries to pay ₹1 instead of ₹48,500
          addedAt: new Date().toISOString(),
        },
      ],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    });

    // Authoritative revalidation
    const cart = getCart(testSessionId);

    // Server must strictly enforce masterProductDatabase price of 4850000 paise (₹48,500)
    expect(cart.items[0].pricePaise).toBe(4850000);
    expect(cart.subtotalPaise).toBe(4850000);
    expect(cart.estimatedTotalPaise).toBe(4850000);
    expect(cart.stalePriceWarning).toContain('Price for "Krishna Solid Teak King Bed with Storage" was updated');
  });

  it('7. unavailable or quote-only products block checkout with a clear message', async () => {
    // Put an inactive or quote-only item in the cart
    masterCartDatabase.set(testSessionId, {
      id: 'cart_ineligible',
      guestSessionId: testSessionId,
      items: [
        {
          id: 'ci_ineligible_01',
          productId: 'prod-pooja-mandir', // Quote-required product
          quantity: 1,
          addedAt: new Date().toISOString(),
        },
      ],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    });

    render(<CartClient />);

    await waitFor(() => {
      expect(screen.getByText('Checkout Blocked')).toBeInTheDocument();
      expect(screen.getByText('Checkout Not Permitted')).toBeInTheDocument();
    });

    // Continue to checkout link must be disabled
    const checkoutLink = screen.getByRole('link', { name: /Continue to Checkout/i });
    expect(checkoutLink).toHaveAttribute('aria-disabled', 'true');
  });

  it('8. guest users cannot access another guest session cart', () => {
    const sessionAlice = 'guest_alice_123';
    const sessionBob = 'guest_bob_456';

    // Alice adds 1 item
    addItemToCart(sessionAlice, { productId: 'prod-teak-king-cot', quantity: 1 });

    // Bob has empty cart initially
    const bobCart = getCart(sessionBob);
    expect(bobCart.items.length).toBe(0);

    // Alice cart has 1 item
    const aliceCart = getCart(sessionAlice);
    expect(aliceCart.items.length).toBe(1);

    // Ensure Bob cannot see Alice's items
    expect(bobCart.guestSessionId).toBe(sessionBob);
    expect(aliceCart.guestSessionId).toBe(sessionAlice);
  });

  it('9. supports real configured discount coupon VUYYURU2026 and rejects arbitrary codes', () => {
    // 1. Valid coupon
    const validResult = masterCartDatabase.get(testSessionId);
    expect(validResult).toBeDefined();

    const appliedCart = revalidateCart({
      ...validResult!,
      appliedCoupon: 'VUYYURU2026',
    });
    // Subtotal 48,500, 5% discount = 2,425 (242,500 paise)
    expect(appliedCart.discountPaise).toBe(242500);
    expect(appliedCart.estimatedTotalPaise).toBe(4850000 - 242500);

    // 2. Invalid arbitrary coupon rejected
    const invalidCart = revalidateCart({
      ...validResult!,
      appliedCoupon: 'FREEFURNITURE100',
    });
    expect(invalidCart.discountPaise).toBe(0);
    expect(invalidCart.estimatedTotalPaise).toBe(4850000);
  });
});
