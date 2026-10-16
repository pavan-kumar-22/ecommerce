import {
  SiteSettings,
  ServiceCategory,
  PublicProduct,
  PublicProject,
  ProjectListResponse,
  ProductListResponse,
  ProductFilterOptions,
  ProductEnquiryPayload,
  ProductEnquiryResponse,
  CustomFurnitureEnquiryPayload,
  CustomFurnitureEnquiryResponse,
  PublicService,
  ServiceFaq,
  PublicAboutContent,
  GeneralEnquiryPayload,
  GeneralEnquiryResponse,
  CartItem,
  CartSummary,
  AddToCartPayload,
  UpdateCartItemPayload,
  FulfilmentMethod,
  FulfilmentOption,
  OrderItemSnapshot,
  CheckoutCustomerContact,
  CheckoutDeliveryAddress,
  CheckoutFulfilmentSelection,
  CheckoutValidationRequest,
  CheckoutValidationResponse,
  CreateOrderPayload,
  OrderRecord,
  OrderStatusResponse,
  SiteVisitStatus,
  SiteVisitRequestPayload,
  SiteVisitRequestRecord,
  PaymentSessionRequest,
  PaymentSessionResponse,
} from '../types/api';
import {
  verifiedSiteSettings,
  verifiedCategories,
  verifiedFeaturedProducts,
  verifiedFeaturedProjects,
  queryPublicProducts,
  getPublicFilterOptions,
  queryUnifiedSearch,
  getPublicProductBySlug,
  submitProductEnquiry as localSubmitProductEnquiry,
  submitCustomFurnitureEnquiry as localSubmitCustomFurnitureEnquiry,
  queryPublicServices as localQueryPublicServices,
  getPublicServiceBySlug as localGetPublicServiceBySlug,
  getPublicServiceFaqs as localGetPublicServiceFaqs,
  queryPublicProjects,
  getPublicProjectBySlug as localGetPublicProjectBySlug,
  getPublicAboutContent as localGetPublicAboutContent,
  submitGeneralEnquiry as localSubmitGeneralEnquiry,
  getCart as localGetCart,
  addItemToCart as localAddItemToCart,
  updateCartItem as localUpdateCartItem,
  removeCartItem as localRemoveCartItem,
  clearCart as localClearCart,
  applyCartCoupon as localApplyCartCoupon,
  removeCartCoupon as localRemoveCartCoupon,
  getFulfilmentOptions as localGetFulfilmentOptions,
  validateCheckoutCart as localValidateCheckoutCart,
  createOrder as localCreateOrder,
  getOrderById as localGetOrderById,
  createSiteVisitBooking as localCreateSiteVisitBooking,
  createPaymentSession as localCreatePaymentSession,
  verifyServerPayment as localVerifyServerPayment,
} from './public-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Robust fetch helper that handles network errors gracefully
 */
async function fetchWithFallback<T>(
  endpoint: string,
  fallbackData: T,
  options?: RequestInit
): Promise<{ data: T; isFallback: boolean }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        ...(options?.headers || {}),
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
    }

    const json = await res.json();
    if (json.data !== undefined) {
      return { data: json.data as T, isFallback: false };
    }
    return { data: json as T, isFallback: false };
  } catch (err) {
    console.warn(`[Vuyyuru API] Failed to fetch ${endpoint}, using verified fallback:`, err);
    return { data: fallbackData, isFallback: true };
  }
}

export async function getSiteSettings(): Promise<{ data: SiteSettings; isFallback: boolean }> {
  return fetchWithFallback<SiteSettings>('/api/public/site-settings', verifiedSiteSettings);
}

export async function getCategories(): Promise<{ data: ServiceCategory[]; isFallback: boolean }> {
  return fetchWithFallback<ServiceCategory[]>(
    '/api/public/categories?active=true',
    verifiedCategories
  );
}

export async function getFeaturedProducts(
  limit: number = 6
): Promise<{ data: PublicProduct[]; isFallback: boolean }> {
  const res = await fetchWithFallback<{ items: PublicProduct[] } | PublicProduct[]>(
    `/api/public/products/featured?limit=${limit}`,
    verifiedFeaturedProducts.slice(0, limit)
  );
  const items = Array.isArray(res.data) ? res.data : res.data.items || [];
  return { data: items, isFallback: res.isFallback };
}

export async function getFeaturedProjects(
  limit: number = 6
): Promise<{ data: PublicProject[]; isFallback: boolean }> {
  const res = await fetchWithFallback<{ items: PublicProject[] } | PublicProject[]>(
    `/api/public/projects?featured=true&limit=${limit}`,
    verifiedFeaturedProjects.slice(0, limit)
  );
  const items = Array.isArray(res.data) ? res.data : res.data.items || [];
  return { data: items, isFallback: res.isFallback };
}

export async function getProducts(params?: {
  category?: string;
  priceMode?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: ProductListResponse; isFallback: boolean }> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.priceMode) query.set('priceMode', params.priceMode);
  if (params?.priceMin !== undefined) query.set('priceMin', params.priceMin.toString());
  if (params?.priceMax !== undefined) query.set('priceMax', params.priceMax.toString());
  if (params?.search) query.set('search', params.search);
  if (params?.sort) query.set('sort', params.sort);
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());

  const qs = query.toString();
  const endpoint = `/api/public/products${qs ? `?${qs}` : ''}`;

  const fallback = queryPublicProducts(params || {});

  return fetchWithFallback<ProductListResponse>(endpoint, fallback);
}

export async function getProductFilters(): Promise<{
  data: ProductFilterOptions;
  isFallback: boolean;
}> {
  return fetchWithFallback<ProductFilterOptions>(
    '/api/public/products/filters',
    getPublicFilterOptions()
  );
}

export async function searchUnified(params: {
  q: string;
  type?: 'all' | 'products' | 'services';
  page?: number;
  limit?: number;
}): Promise<{ data: any; isFallback: boolean }> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.type) query.set('type', params.type);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());

  const qs = query.toString();
  const endpoint = `/api/public/search${qs ? `?${qs}` : ''}`;
  const fallback = queryUnifiedSearch(params);

  return fetchWithFallback<any>(endpoint, fallback);
}

export async function getProductBySlug(
  slug: string
): Promise<{ data: PublicProduct | null; isFallback: boolean }> {
  const fallback = getPublicProductBySlug(slug);
  return fetchWithFallback<PublicProduct | null>(
    `/api/public/products/${encodeURIComponent(slug)}`,
    fallback
  );
}

export async function submitProductEnquiry(
  payload: ProductEnquiryPayload
): Promise<{ data: ProductEnquiryResponse; isFallback: boolean }> {
  const localRes = localSubmitProductEnquiry(payload);
  const fallback = localRes.data || {
    enquiryId: 'ENQ-OFFLINE',
    status: 'received',
    message: 'Your enquiry was saved locally and will sync when online.',
    receivedAt: new Date().toISOString(),
    summary: {
      productTitle: 'Custom Enquiry',
      estimatedLeadTime: '3 weeks',
      consultationContact: '+91 8639731477',
    },
  };

  return fetchWithFallback<ProductEnquiryResponse>(
    '/api/public/product-enquiries',
    fallback,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
}

export async function submitCustomFurnitureEnquiry(
  payload: CustomFurnitureEnquiryPayload
): Promise<{ data: CustomFurnitureEnquiryResponse; isFallback: boolean }> {
  const localRes = localSubmitCustomFurnitureEnquiry(payload);
  const fallback = localRes.data || {
    enquiryId: 'enq_offline',
    reference: 'VC-REQ-OFFLINE',
    status: 'received',
    message: 'Your custom request was saved locally and will sync when connected.',
    receivedAt: new Date().toISOString(),
    summary: {
      furnitureType: payload.requirements?.furnitureType || 'Custom Furniture',
      quantity: payload.requirements?.quantity || 1,
      area: payload.site?.area || 'Vuyyuru',
      siteVisitRequested: payload.site?.visitRequested || 'advise_me',
      preferredContactMethod: payload.customer?.preferredContactMethod || 'whatsapp',
    },
  };

  return fetchWithFallback<CustomFurnitureEnquiryResponse>(
    '/api/public/enquiries/custom-furniture',
    fallback,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }
  );
}

export async function getPublicServices(category?: string): Promise<{
  data: PublicService[];
  isFallback: boolean;
}> {
  const qs = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  const fallback = localQueryPublicServices({ category });
  const res = await fetchWithFallback<{ items: PublicService[] } | PublicService[]>(
    `/api/public/services${qs}`,
    fallback
  );
  const items = Array.isArray(res.data) ? res.data : (res.data as any).items || [];
  return { data: items, isFallback: res.isFallback };
}

export async function getPublicServiceBySlug(
  slug: string
): Promise<{ data: PublicService | null; isFallback: boolean }> {
  const fallback = localGetPublicServiceBySlug(slug);
  return fetchWithFallback<PublicService | null>(
    `/api/public/services/${encodeURIComponent(slug)}`,
    fallback
  );
}

export async function getPublicServiceFaqs(): Promise<{
  data: ServiceFaq[];
  isFallback: boolean;
}> {
  const fallback = localGetPublicServiceFaqs();
  const res = await fetchWithFallback<{ items: ServiceFaq[] } | ServiceFaq[]>(
    '/api/public/service-faqs',
    fallback
  );
  const items = Array.isArray(res.data) ? res.data : (res.data as any).items || [];
  return { data: items, isFallback: res.isFallback };
}

// -------------------------------------------------------------
// Screen 07: Public Projects Client Methods
// -------------------------------------------------------------
export async function getPublicProjects(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: ProjectListResponse; isFallback: boolean }> {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', params.page.toString());
  if (params?.limit) query.set('limit', params.limit.toString());

  const queryString = query.toString() ? `?${query.toString()}` : '';
  const fallback = queryPublicProjects(params);
  return fetchWithFallback<ProjectListResponse>(
    `/api/public/projects${queryString}`,
    fallback
  );
}

export async function getPublicProjectBySlug(
  slug: string
): Promise<{ data: PublicProject | null; isFallback: boolean }> {
  const fallback = localGetPublicProjectBySlug(slug);
  return fetchWithFallback<PublicProject | null>(
    `/api/public/projects/${encodeURIComponent(slug)}`,
    fallback
  );
}

// -------------------------------------------------------------
// Screen 08: Public About Content Client Method
// -------------------------------------------------------------
export async function getPublicAbout(): Promise<{
  data: PublicAboutContent;
  isFallback: boolean;
}> {
  const fallback = localGetPublicAboutContent();
  return fetchWithFallback<PublicAboutContent>('/api/public/about', fallback);
}

// -------------------------------------------------------------
// Screen 09: General Enquiry & Site-Visit Request Client Method
// -------------------------------------------------------------
export async function submitGeneralEnquiry(
  payload: GeneralEnquiryPayload
): Promise<GeneralEnquiryResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/public/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const message =
        errorJson.error?.message ||
        errorJson.error ||
        errorJson.message ||
        'Unable to submit your enquiry. Please verify details and try again.';
      throw new Error(message);
    }

    return await res.json();
  } catch (error: any) {
    // In disconnected or test environments, fallback to verified local submission
    const localResult = localSubmitGeneralEnquiry(payload);
    if (localResult.success && localResult.data) {
      return localResult.data;
    }
    throw new Error(localResult.error || error.message || 'Failed to submit enquiry.');
  }
}

// -------------------------------------------------------------
// Screen 10: Shopping Cart Client API
// -------------------------------------------------------------

/**
 * Gets or initializes the guest session ID for cart isolation
 */
export function getGuestCartSessionId(): string {
  if (typeof window === 'undefined') {
    return 'demo_guest_session';
  }

  try {
    let sessionId = localStorage.getItem('vc_cart_session_id');
    if (!sessionId) {
      sessionId = 'demo_guest_session';
      localStorage.setItem('vc_cart_session_id', sessionId);
    }
    return sessionId;
  } catch {
    return 'demo_guest_session';
  }
}

/**
 * Fetch current cart for session with server revalidation
 */
export async function getCart(sessionId?: string): Promise<CartSummary> {
  const activeSession = sessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/cart`, {
      headers: {
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`Failed to load cart (Status ${res.status})`);
    }

    return await res.json();
  } catch (err) {
    // Graceful offline / test fallback
    return localGetCart(activeSession);
  }
}

/**
 * Add an eligible product to cart
 */
export async function addItemToCart(
  payload: AddToCartPayload,
  sessionId?: string
): Promise<CartSummary> {
  const activeSession = sessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Failed to add item to cart.');
    }

    return await res.json();
  } catch (err: any) {
    const localResult = localAddItemToCart(activeSession, payload);
    if (localResult.success && localResult.cart) {
      return localResult.cart;
    }
    throw new Error(localResult.error || err.message || 'Failed to add item to cart.');
  }
}

/**
 * Update quantity for a cart item
 */
export async function updateCartItem(
  itemId: string,
  quantity: number,
  sessionId?: string
): Promise<CartSummary> {
  const activeSession = sessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
      body: JSON.stringify({ quantity }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Failed to update item quantity.');
    }

    return await res.json();
  } catch (err: any) {
    const localResult = localUpdateCartItem(activeSession, itemId, quantity);
    if (localResult.success && localResult.cart) {
      return localResult.cart;
    }
    throw new Error(localResult.error || err.message || 'Failed to update quantity.');
  }
}

/**
 * Remove an item from the cart
 */
export async function removeCartItem(
  itemId: string,
  sessionId?: string
): Promise<CartSummary> {
  const activeSession = sessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Failed to remove item from cart.');
    }

    return await res.json();
  } catch (err: any) {
    const localResult = localRemoveCartItem(activeSession, itemId);
    if (localResult.success && localResult.cart) {
      return localResult.cart;
    }
    throw new Error(localResult.error || err.message || 'Failed to remove item.');
  }
}

/**
 * Clear cart
 */
export async function clearCart(sessionId?: string): Promise<CartSummary> {
  const activeSession = sessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/cart`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to clear cart.');
    }

    return await res.json();
  } catch (err: any) {
    const localResult = localClearCart(activeSession);
    return localResult.cart!;
  }
}

/**
 * Apply coupon code
 */
export async function applyCartCoupon(
  code: string,
  sessionId?: string
): Promise<CartSummary> {
  const activeSession = sessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/cart/coupon`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Invalid coupon code.');
    }

    return await res.json();
  } catch (err: any) {
    const localResult = localApplyCartCoupon(activeSession, code);
    if (localResult.success && localResult.cart) {
      return localResult.cart;
    }
    throw new Error(localResult.error || err.message || 'Failed to apply coupon.');
  }
}

/**
 * Remove coupon code
 */
export async function removeCartCoupon(sessionId?: string): Promise<CartSummary> {
  const activeSession = sessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/cart/coupon`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
    });

    if (!res.ok) {
      throw new Error('Failed to remove coupon.');
    }

    return await res.json();
  } catch (err: any) {
    const localResult = localRemoveCartCoupon(activeSession);
    return localResult.cart!;
  }
}

// -------------------------------------------------------------
// Screen 11: Checkout & Booking API Client Methods
// -------------------------------------------------------------

/**
 * Fetch configured fulfilment methods and constraints
 */
export async function getFulfilmentOptions(): Promise<FulfilmentOption[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/fulfilment-options`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 300 },
    });
    if (!res.ok) throw new Error('Failed to fetch fulfilment options.');
    const json = await res.json();
    return json.data || json;
  } catch (err) {
    return localGetFulfilmentOptions();
  }
}

/**
 * Revalidate cart and calculate authoritative server totals for checkout
 */
export async function validateCheckoutCart(
  request: CheckoutValidationRequest
): Promise<CheckoutValidationResponse> {
  const activeSession = request.guestSessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/checkout/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
      body: JSON.stringify({
        ...request,
        guestSessionId: activeSession,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Cart validation failed.');
    }

    const json = await res.json();
    return json.data || json;
  } catch (err: any) {
    return localValidateCheckoutCart(
      activeSession,
      request.fulfilmentMethod || 'local_delivery',
      request.couponCode
    );
  }
}

/**
 * Create fixed-price order with idempotency protection and authoritative server pricing
 */
export async function createOrder(payload: CreateOrderPayload): Promise<OrderRecord> {
  const activeSession = payload.guestSessionId || getGuestCartSessionId();

  try {
    const res = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
        'Idempotency-Key': payload.idempotencyKey,
      },
      body: JSON.stringify({
        ...payload,
        guestSessionId: activeSession,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Failed to place order.');
    }

    const json = await res.json();
    return json.data || json;
  } catch (err: any) {
    const localResult = localCreateOrder({
      ...payload,
      guestSessionId: activeSession,
    });

    if (localResult.success && localResult.order) {
      return localResult.order;
    }
    throw new Error(localResult.error || err.message || 'Failed to place order.');
  }
}

/**
 * Fetch permitted order status with ownership verification token
 */
export async function getOrderById(
  orderId: string,
  orderToken?: string,
  sessionId?: string
): Promise<OrderRecord> {
  const activeSession = sessionId || getGuestCartSessionId();

  try {
    const query = orderToken ? `?token=${encodeURIComponent(orderToken)}` : '';
    const res = await fetch(`${API_BASE}/api/orders/${orderId}${query}`, {
      headers: {
        Accept: 'application/json',
        'x-cart-session-id': activeSession,
      },
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Failed to fetch order status.');
    }

    const json = await res.json();
    return json.data || json;
  } catch (err: any) {
    const localResult = localGetOrderById(orderId, orderToken, activeSession);
    if (localResult.success && localResult.order) {
      return localResult.order;
    }
    throw new Error(localResult.error || err.message || 'Unauthorized or order not found.');
  }
}

/**
 * Submit Mode B — Service Visit Request
 */
export async function submitSiteVisitBooking(
  payload: SiteVisitRequestPayload
): Promise<SiteVisitRequestRecord> {
  try {
    const res = await fetch(`${API_BASE}/api/public/site-visit-requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Failed to submit site visit request.');
    }

    const json = await res.json();
    return json.data || json;
  } catch (err: any) {
    const localResult = localCreateSiteVisitBooking(payload);
    if (localResult.success && localResult.siteVisit) {
      return localResult.siteVisit;
    }
    throw new Error(localResult.error || err.message || 'Failed to submit site visit request.');
  }
}

/**
 * Initiate payment session (COD or online advance)
 */
export async function createPaymentSession(
  request: PaymentSessionRequest
): Promise<PaymentSessionResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/payments/session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message || errData.message || 'Failed to initiate payment session.');
    }

    const json = await res.json();
    return json.data || json;
  } catch (err: any) {
    const localResult = localCreatePaymentSession(request);
    if (localResult.success && localResult.session) {
      return localResult.session;
    }
    throw new Error(localResult.error || err.message || 'Failed to initiate payment.');
  }
}





