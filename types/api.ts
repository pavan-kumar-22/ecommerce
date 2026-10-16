/**
 * Vuyyuru Carpentry - Public Storefront API Type Definitions
 * Strict contracts for public-facing customer data.
 * Adheres to privacy guidelines: No private customer PII, addresses, or unapproved photos.
 */

export type PriceMode = 'fixed' | 'starting_from' | 'quote_required';

export interface PublicAddress {
  line1: string;
  town: string;
  district: string;
  state: string;
  pincode: string;
}

export interface PublicContactSettings {
  phone?: string | null;
  phoneRaw?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address: PublicAddress;
  workingHours: string;
}

export interface PublicHeroSettings {
  badge: string;
  heading: string;
  subheading: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  heroImage: {
    url: string;
    alt: string;
    credit?: string;
  };
}

export interface PublicAnnouncement {
  enabled: boolean;
  text: string;
  linkUrl?: string | null;
}

export interface SiteSettings {
  businessName: string;
  tagline: string;
  serviceAreaSummary: string;
  announcement?: PublicAnnouncement;
  contact: PublicContactSettings;
  hero: PublicHeroSettings;
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface ServiceCategory {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  iconName: 'Hammer' | 'Sofa' | 'DoorClosed' | 'Utensils' | 'Sparkles' | 'Store' | 'Ruler';
  itemCount: number;
  route: string;
}

export type ServiceCategoryKey =
  | 'repair'
  | 'custom_furniture'
  | 'doors_wardrobes'
  | 'interiors'
  | 'finishing'
  | 'commercial';

export type ServicePricingMode = 'fixed' | 'indicative' | 'inspection_required';

export interface PublicService {
  id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  category: ServiceCategoryKey;
  categoryName: string;
  pricingMode: ServicePricingMode;
  indicativeMinPaise?: number; // Integer paise (e.g. 50000 = ₹500)
  indicativeMaxPaise?: number; // Integer paise (e.g. 350000 = ₹3,500)
  scopeNotes: string[];
  exclusions?: string[];
  imageUrl?: string;
  iconName: string;
  status: 'draft' | 'active' | 'archived';
  displayOrder: number;
  leadTimeEstimate?: string;
  typicalDuration?: string;
  serviceAreaNotice?: string;
}

export interface ServiceFaq {
  id: string;
  question: string;
  answer: string;
  category?: string;
  displayOrder: number;
}

export interface ProductDimensionLimits {
  minWidthInches?: number;
  maxWidthInches?: number;
  minHeightInches?: number;
  maxHeightInches?: number;
  minDepthInches?: number;
  maxDepthInches?: number;
}

export interface ProductDimensions {
  standard: {
    widthInches: number;
    heightInches: number;
    depthInches: number;
    summary: string;
  };
  customizable: boolean;
  limits?: ProductDimensionLimits;
}

export interface ProductGalleryAsset {
  url: string;
  alt: string;
  caption?: string;
}

export interface ProductSizeOption {
  id: string;
  label: string;
  dimensionsSummary: string;
  priceDiffPaise?: number;
}

export interface OrderingStep {
  step: number;
  title: string;
  description: string;
}

export interface PublicProduct {
  id: string;
  sku?: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  primaryImage: {
    url: string;
    alt: string;
  } | null;
  galleryImages?: ProductGalleryAsset[];
  priceMode: PriceMode;
  salePricePaise?: number; // Integer paise (e.g. 4850000 = ₹48,500)
  startingPricePaise?: number; // Integer paise
  startingPrice?: number | null; // INR helper for compatibility
  currency: 'INR';
  status: 'draft' | 'active' | 'archived';
  visibility: 'public' | 'private';
  woodSpecies?: string[];
  supportedWoodSpecies?: string[];
  dimensionsSummary?: string;
  dimensions?: ProductDimensions;
  finishType?: string;
  supportedFinishes?: string[];
  supportedSizes?: ProductSizeOption[];
  isCustomizable?: boolean;
  leadTimeWeeks?: number;
  availabilityLabel?: 'Made to Order' | 'Showroom Sample' | 'Crafted upon Booking';
  inclusions?: string[];
  exclusions?: string[];
  hardwareSpecs?: string[];
  deliveryNotice?: string;
  orderingSteps?: OrderingStep[];
  relatedProducts?: PublicProduct[];
  createdAt?: string;
}

export interface ProductEnquiryPayload {
  productId: string;
  productSlug: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryTown: string;
  requestedOptions: {
    woodSpecies?: string;
    finish?: string;
    sizeVariant?: string;
    customDimensions?: string;
  };
  quantity: number;
  message: string;
}

export interface ProductEnquiryResponse {
  enquiryId: string;
  status: 'received';
  message: string;
  receivedAt: string;
  summary: {
    productTitle: string;
    estimatedLeadTime: string;
    consultationContact: string;
  };
}

export interface ProjectImage {
  url: string;
  alt: string;
  kind?: 'before' | 'after' | 'finished';
}

export type ProjectPublicationStatus = 'draft' | 'published' | 'archived';
export type PhotoPermissionStatus = 'approved' | 'pending' | 'denied';

export interface PublicProject {
  id: string;
  title: string;
  slug: string;
  category: string; // 'furniture' | 'doors' | 'wardrobes' | 'interiors' | 'repairs'
  summary: string;
  description?: string;
  images: ProjectImage[];
  generalArea?: string; // e.g. "Vuyyuru", "Vijayawada", "Guntur", "Tenali"
  location: string; // Backward compatibility alias
  year: number;
  completedAt?: string;
  materialsUsed: string[];
  scopeHighlights?: string[];
  clientFeedbackQuote?: string;
  coverImage: {
    url: string;
    alt: string;
  };
  publicationStatus: ProjectPublicationStatus;
  photoPermissionStatus: PhotoPermissionStatus;
  photoPermissionGranted: boolean; // Backward compatibility helper
}

export interface ProjectListResponse {
  items: PublicProject[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filters: {
    category?: string;
    search?: string;
  };
}

export interface ProductListResponse {
  items: PublicProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filters: {
    category?: string;
    priceMode?: string;
    priceMin?: number;
    priceMax?: number;
    search?: string;
    sort?: string;
  };
}

export interface ProductFilterOptions {
  categories: { slug: string; name: string; count: number }[];
  priceModes: { mode: PriceMode; label: string; count: number }[];
  priceBounds: { min: number; max: number };
  sortOptions: { value: string; label: string }[];
}

// -------------------------------------------------------------
// Unified Search Type Contracts (Screen 03)
// -------------------------------------------------------------
export type SearchResultKind = 'product' | 'service';

export interface ProductSearchResult {
  kind: 'product';
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl?: string | null;
  categoryName: string;
  categorySlug: string;
  woodSpecies?: string[];
  priceMode: PriceMode;
  salePricePaise?: number;
  startingPricePaise?: number;
  currency: 'INR';
  isCustomizable?: boolean;
  availabilityLabel?: string;
}

export interface ServiceSearchResult {
  kind: 'service';
  id: string;
  title: string;
  slug: string;
  summary: string;
  route: string;
  iconName?: string;
  categoryName?: string;
}

export type UnifiedSearchResult = ProductSearchResult | ServiceSearchResult;
export type SearchTabType = 'all' | 'products' | 'services';

export interface SearchApiResponse {
  query: string;
  type: SearchTabType;
  items: UnifiedSearchResult[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  counts: {
    all: number;
    products: number;
    services: number;
  };
  matchedCategories: { slug: string; name: string }[];
  suggestions: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
}

export interface StandardApiError {
  code:
    | 'VALIDATION_ERROR'
    | 'NOT_FOUND'
    | 'UNAUTHORIZED'
    | 'FORBIDDEN'
    | 'CONFLICT'
    | 'RATE_LIMITED'
    | 'INTERNAL_ERROR';
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface StandardErrorResponse {
  error: StandardApiError;
  timestamp?: string;
}

// -------------------------------------------------------------
// Screen 05: Custom Furniture Wizard Models
// -------------------------------------------------------------
export type FurnitureType =
  | 'bed'
  | 'wardrobe'
  | 'table'
  | 'door'
  | 'shelf'
  | 'tv_unit'
  | 'kitchen_cabinet'
  | 'pooja_unit'
  | 'partition'
  | 'commercial_fixture'
  | 'other';

export type DimensionConfidence = 'measured' | 'approximate' | 'not_sure';
export type SiteVisitRequested = 'yes' | 'no' | 'advise_me';
export type PreferredContactMethod = 'phone' | 'whatsapp' | 'email';
export type PreferredTimeWindow = 'morning' | 'afternoon' | 'evening';
export type ProjectNature = 'new' | 'replacement' | 'repair_mod';
export type UrgencyLevel = 'flexible' | 'within_month' | 'one_to_two_months' | 'urgent';

export interface ReferencePhotoMeta {
  id: string;
  url: string;
  filename: string;
  sizeBytes: number;
}

export interface CustomFurnitureEnquiryPayload {
  type: 'custom_furniture';
  requirements: {
    furnitureType: FurnitureType;
    customFurnitureType?: string;
    room?: string;
    description: string;
    quantity: number;
    projectNature?: ProjectNature;
    urgency?: UrgencyLevel;
    dimensions: {
      widthMm?: number;
      heightMm?: number;
      depthMm?: number;
      confidence: DimensionConfidence;
    };
    materialPreference?: string;
    finishPreference?: string;
    colorPreference?: string;
    features?: string[];
    referenceUrl?: string;
  };
  site: {
    area: string;
    visitRequested: SiteVisitRequested;
    preferredDate?: string | null;
    preferredTimeWindow?: PreferredTimeWindow | null;
    accessNotes?: string;
  };
  customer: {
    name: string;
    phone: string;
    whatsappAvailable: boolean;
    email?: string;
    preferredContactMethod: PreferredContactMethod;
  };
  consent: {
    contactForThisEnquiry: boolean;
    marketingOptIn: boolean;
    privacyNoticeVersion: string;
  };
  referencePhotos?: ReferencePhotoMeta[];
}

export interface CustomFurnitureEnquiryResponse {
  enquiryId: string;
  reference: string;
  status: 'received';
  message: string;
  receivedAt: string;
  summary: {
    furnitureType: string;
    quantity: number;
    area: string;
    siteVisitRequested: SiteVisitRequested;
    preferredContactMethod: PreferredContactMethod;
  };
}

// -------------------------------------------------------------
// Screen 08: About The Business Contracts
// -------------------------------------------------------------
export interface AboutValue {
  id: string;
  title: string;
  description: string;
  iconName?: 'FileText' | 'Clock' | 'TreePine' | 'Sparkles' | 'ShieldCheck' | 'MapPin';
}

export interface AboutProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface AboutWorkshopPhoto {
  url: string;
  alt: string;
  caption?: string;
  approvedForPublication: boolean;
}

export interface PublicAboutContent {
  businessName: string;
  tagline: string;
  headline: string;
  subheading: string;
  storyParagraphs: string[];
  serviceAreaStatement: string;
  values: AboutValue[];
  processSteps: AboutProcessStep[];
  teamStatement?: string;
  workshopPhoto?: AboutWorkshopPhoto;
  contactSummary: {
    phone: string;
    whatsapp: string;
    workshopAddress: string;
    consultationHours: string;
  };
  servicesSummary: {
    title: string;
    description: string;
    linkHref: string;
    linkText: string;
  };
}

// -------------------------------------------------------------
// Screen 09: General Enquiry & Site-Visit Request Contracts
// -------------------------------------------------------------
export type EnquiryUrgency = 'flexible' | 'within_2_weeks' | 'urgent_48h';
export type EnquirySiteVisitOption = 'yes' | 'no' | 'advise_me';
export type EnquiryContactMethod = 'phone' | 'whatsapp' | 'email';
export type PreferredVisitTimeWindow = 'morning' | 'afternoon' | 'evening';

export interface GeneralEnquiryPayload {
  serviceId: string; // active service id or slug
  description: string;
  urgency?: EnquiryUrgency;
  location: {
    area: string;
    fullAddress?: string; // private, only collected if site visit is requested
  };
  siteVisit: {
    requested: EnquirySiteVisitOption;
    preferredDate?: string | null;
    preferredTimeWindow?: PreferredVisitTimeWindow | null;
  };
  customer: {
    name: string;
    phone: string;
    email?: string;
    preferredContactMethod: EnquiryContactMethod;
  };
  consent: {
    contactForThisEnquiry: boolean;
    marketingOptIn?: boolean;
  };
  referencePhotos?: Array<{
    id: string;
    url: string;
    filename: string;
    sizeBytes: number;
    contentType?: string;
  }>;
}

export interface GeneralEnquiryResponse {
  enquiryId: string;
  reference: string; // authoritative server-generated e.g. "VC-ENQ-2026-4820"
  status: 'received';
  message: string;
  receivedAt: string;
  summary: {
    serviceName: string;
    area: string;
    urgency: string;
    siteVisitRequested: EnquirySiteVisitOption;
    preferredContactMethod: EnquiryContactMethod;
    preferredDate?: string | null;
    preferredTimeWindow?: string | null;
    consultationNotice: string;
  };
}

// -------------------------------------------------------------
// Screen 10: Shopping Cart Contracts
// -------------------------------------------------------------
export interface CartItem {
  id: string; // Cart line-item unique identifier e.g. "ci_..."
  productId: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  pricePaise: number; // Unit price in integer paise
  originalPricePaise?: number; // Snapshot price if changed
  priceChanged?: boolean;
  quantity: number;
  lineTotalPaise: number; // quantity * pricePaise
  isEligible: boolean; // Only fixed-price products are purchasable online
  eligibilityReason?: string | null;
  selectedWoodSpecies?: string;
  selectedFinish?: string;
  dimensionsSummary?: string;
}

export interface CartSummary {
  id: string;
  guestSessionId: string;
  items: CartItem[];
  currency: 'INR';
  subtotalPaise: number;
  deliveryChargesPaise: number;
  deliveryNotice: string;
  taxPaise: number;
  taxNotice: string;
  discountPaise: number;
  appliedCouponCode?: string | null;
  estimatedTotalPaise: number;
  hasIneligibleItems: boolean;
  stalePriceWarning?: string | null;
  canCheckout: boolean;
  totalItemCount: number;
  updatedAt: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
  selectedWoodSpecies?: string;
  selectedFinish?: string;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

// -------------------------------------------------------------
// Screen 11: Checkout & Booking Contracts
// -------------------------------------------------------------

export type CheckoutMode = 'fixed_price' | 'service_visit';

export type OrderStatus =
  | 'pending_review'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus =
  | 'unpaid'
  | 'pending'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export type PaymentMethod = 'pay_on_delivery' | 'online_upi_advance';

export type FulfilmentMethod =
  | 'workshop_collection'
  | 'local_delivery'
  | 'delivery_installation';

export interface FulfilmentOption {
  id: FulfilmentMethod;
  name: string;
  description: string;
  pricePaise: number;
  estimatedDays: string;
  requiresAddress: boolean;
  notes: string;
}

export interface OrderItemSnapshot {
  productId: string;
  productSlug: string;
  productName: string;
  category: string;
  image: string;
  selectedWoodSpecies?: string;
  selectedFinish?: string;
  dimensionsSummary?: string;
  quantity: number;
  unitPricePaise: number;
  lineTotalPaise: number;
}

export interface CheckoutCustomerContact {
  name: string;
  phone: string;
  email?: string;
}

export interface CheckoutDeliveryAddress {
  area: string;
  addressLine: string;
  landmark?: string;
  pincode?: string;
}

export interface CheckoutFulfilmentSelection {
  method: FulfilmentMethod;
  address?: CheckoutDeliveryAddress;
  preferredSchedule?: string;
}

export interface CheckoutValidationRequest {
  guestSessionId: string;
  fulfilmentMethod?: FulfilmentMethod;
  couponCode?: string;
}

export interface CheckoutValidationResponse {
  valid: boolean;
  currency: 'INR';
  items: CartItem[];
  subtotalPaise: number;
  deliveryPaise: number;
  installationPaise: number;
  taxPaise: number;
  discountPaise: number;
  totalPaise: number;
  changes: string[];
  canCheckout: boolean;
  policyNotice: string;
}

export interface CreateOrderPayload {
  idempotencyKey: string;
  guestSessionId: string;
  contact: CheckoutCustomerContact;
  fulfilment: CheckoutFulfilmentSelection;
  paymentMethod: PaymentMethod;
  orderNotes?: string;
  termsAccepted: boolean;
}

export interface OrderRecord {
  id: string; // e.g. "ord_1792..."
  orderReference: string; // e.g. "VC-ORD-2026-8921"
  orderToken: string; // Secret customer verification token for privacy
  guestSessionId: string;
  items: OrderItemSnapshot[];
  contact: CheckoutCustomerContact;
  fulfilment: {
    method: FulfilmentMethod;
    methodName: string;
    address?: CheckoutDeliveryAddress;
    preferredSchedule?: string;
    deliveryChargesPaise: number;
    installationChargesPaise: number;
  };
  pricing: {
    currency: 'INR';
    subtotalPaise: number;
    deliveryChargesPaise: number;
    installationChargesPaise: number;
    taxPaise: number;
    discountPaise: number;
    appliedCouponCode?: string | null;
    totalPaise: number;
  };
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    transactionId?: string;
    paidAt?: string;
    gatewayReference?: string;
  };
  orderNotes?: string;
  termsAccepted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusResponse {
  order: OrderRecord;
  permitted: boolean;
}

export type SiteVisitStatus =
  | 'received'
  | 'reviewing'
  | 'visit_pending_confirmation'
  | 'confirmed'
  | 'declined'
  | 'reschedule_requested';

export interface SiteVisitRequestPayload {
  serviceId: string;
  workDescription: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  area: string;
  fullAddress?: string;
  preferredDate: string;
  preferredTimeWindow: 'morning' | 'afternoon' | 'evening';
  referencePhotosSummary?: string;
  consentAccepted: boolean;
}

export interface SiteVisitRequestRecord {
  id: string;
  reference: string; // e.g. "VC-SVR-2026-3829"
  serviceId: string;
  serviceName: string;
  workDescription: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  location: {
    area: string;
    fullAddress?: string;
  };
  schedulePreference: {
    preferredDate: string;
    preferredTimeWindow: string;
  };
  visitFeePolicy: {
    isComplimentary: boolean;
    feeDescription: string;
  };
  status: SiteVisitStatus;
  statusLabel: string;
  createdAt: string;
}

export interface PaymentSessionRequest {
  orderId: string;
  orderToken: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentSessionResponse {
  sessionId: string;
  orderId: string;
  orderReference: string;
  amountPaise: number;
  currency: 'INR';
  status: 'initiated' | 'completed' | 'failed';
  paymentMethod: PaymentMethod;
  instructions: string;
}

