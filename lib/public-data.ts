import {
  SiteSettings,
  ServiceCategory,
  PublicProduct,
  PublicProject,
  ProjectListResponse,
  ProductFilterOptions,
  ProductEnquiryPayload,
  ProductEnquiryResponse,
  ProductGalleryAsset,
  ProductDimensions,
  OrderingStep,
  CustomFurnitureEnquiryPayload,
  CustomFurnitureEnquiryResponse,
  PublicService,
  ServiceFaq,
  PublicAboutContent,
  AboutValue,
  AboutProcessStep,
  AboutWorkshopPhoto,
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

export const verifiedSiteSettings: SiteSettings = {
  businessName: 'Vuyyuru Carpentry',
  tagline: 'Handcrafted Solid Teak Furniture & Architectural Joinery in Andhra Pradesh',
  serviceAreaSummary:
    'Headquartered in Vuyyuru town. Providing workshop fabrication and on-site carpentry across Vuyyuru, Vijayawada, Guntur, and nearby Krishna/NTR districts subject to travel feasibility.',
  announcement: {
    enabled: true,
    text: 'Now scheduling custom woodwork consultations for upcoming house-warmings across Vuyyuru & Vijayawada region.',
    linkUrl: '/custom-furniture',
  },
  contact: {
    phone: '+91 8639731477',
    phoneRaw: '+918639731477',
    whatsapp: '918639731477',
    email: 'namaste@vuyyurucarpentry.in',
    address: {
      line1: 'Near RTC Bus Stand, Main Bazar Road',
      town: 'Vuyyuru',
      district: 'Krishna District',
      state: 'Andhra Pradesh',
      pincode: '521165',
    },
    workingHours: 'Mon – Sat: 8:30 AM to 7:30 PM (Sunday site visits by advance appointment)',
  },
  hero: {
    badge: 'CUSTOM CARPENTRY · VUYYURU & SUITABLE NEARBY AREAS',
    heading: 'Made for your space. Built with care.',
    subheading:
      'Repairs, custom furniture, doors, wardrobes, kitchens and carpentry finishing. Handcrafted by experienced local artisans with genuine seasoned timber.',
    primaryCtaText: 'Request a custom quote',
    primaryCtaLink: '/custom-furniture',
    secondaryCtaText: 'Browse products',
    secondaryCtaLink: '/products',
    heroImage: {
      url: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1200&q=80',
      alt: 'Artisanal carpenter hand-planning seasoned teak wood in workshop',
      credit: 'Vuyyuru Carpentry Workshop Bay',
    },
  },
  socialLinks: [
    { platform: 'WhatsApp', url: 'https://wa.me/918639731477' },
    { platform: 'Google Business Profile', url: 'https://maps.google.com' },
  ],
};

export const verifiedCategories: ServiceCategory[] = [
  {
    id: 'cat-beds',
    slug: 'beds',
    name: 'Beds & Cots',
    shortDescription: 'Solid teakwood cots with optional hydraulic box storage and headboard carvings.',
    iconName: 'Sofa',
    itemCount: 4,
    route: '/products?category=beds',
  },
  {
    id: 'cat-doors',
    slug: 'doors',
    name: 'Doors & Frames',
    shortDescription: 'Solid Ghana and Burma teak main doors with traditional floral and temple motifs.',
    iconName: 'DoorClosed',
    itemCount: 3,
    route: '/products?category=doors',
  },
  {
    id: 'cat-wardrobes',
    slug: 'wardrobes',
    name: 'Wardrobes & Closets',
    shortDescription: 'Custom hinged and sliding modular wardrobes using BWP ply or Action TESA HDHMR.',
    iconName: 'DoorClosed',
    itemCount: 4,
    route: '/products?category=wardrobes',
  },
  {
    id: 'cat-storage',
    slug: 'storage',
    name: 'Storage & Mandirs',
    shortDescription: 'Traditional pooja mandirs, crockery units, and wall-mounted display shelving.',
    iconName: 'Sparkles',
    itemCount: 3,
    route: '/products?category=storage',
  },
  {
    id: 'cat-tables',
    slug: 'tables',
    name: 'Dining & Tables',
    shortDescription: 'Solid timber dining sets, coffee tables, study desks, and bench seating.',
    iconName: 'Sofa',
    itemCount: 3,
    route: '/products?category=tables',
  },
  {
    id: 'cat-kitchens',
    slug: 'kitchens',
    name: 'Modular Kitchens',
    shortDescription: 'Marine BWP IS:710 ply carcasses with soft-close tandem boxes and acrylic shutters.',
    iconName: 'Utensils',
    itemCount: 2,
    route: '/products?category=kitchens',
  },
];

/**
 * Master Product Database
 * Includes internal products with status='draft' or visibility='private' to test
 * that public filters strictly omit them.
 */
export const masterProductDatabase: (PublicProduct & {
  // Admin-only fields (MUST NEVER be exposed to public API)
  internalNotes?: string;
  supplierCostPaise?: number;
  grossMarginPercentage?: number;
})[] = [
    {
      id: 'prod-teak-king-cot',
      sku: 'VC-COT-KING-01',
      name: 'Krishna Solid Teak King Bed with Storage',
      slug: 'krishna-solid-teak-king-bed',
      shortDescription: 'Handcrafted king bed featuring CP teakwood framing and hydraulic under-bed storage.',
      fullDescription:
        'Constructed using premium seasoned Central Province (CP) teakwood hand-selected at our Vuyyuru workshop. The Krishna King Cot features heavy-gauge mortise-and-tenon framing paired with an effortless hydraulic lifting mechanism revealing a waterproof BWP 710 marine ply storage chamber. Hand-sanded and finished with multi-coat melamine sealer that resists Andhra Pradesh tropical humidity and seasonal wood expansion.',
      categoryId: 'cat-beds',
      categorySlug: 'beds',
      categoryName: 'Beds & Cots',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        alt: 'Solid teak king bed frame with headboard detailing',
      },
      galleryImages: [
        {
          url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
          alt: 'Krishna Solid Teak King Bed Headboard and Frame',
          caption: 'Solid CP teak headboard with traditional hand-fluted accents',
        },
        {
          url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b4f?auto=format&fit=crop&w=1200&q=80',
          alt: 'Hand-Sanded Teakwood Grain Texture',
          caption: 'Multi-stage hand sanding with natural melamine protective coat',
        },
        {
          url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
          alt: 'Under-Bed Hydraulic Storage Compartment',
          caption: 'BWP 710 marine ply box with dual German gas struts',
        },
      ],
      priceMode: 'fixed',
      salePricePaise: 4850000, // ₹48,500
      startingPrice: 48500,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['CP Teakwood', 'BWP Marine Ply Box'],
      supportedWoodSpecies: ['CP Teakwood (Standard)', 'Burma Teak (Premium Grade)', 'Ghana Teak (Economic Solid)'],
      dimensionsSummary: '78" L x 72" W x 42" H (King Size)',
      dimensions: {
        standard: {
          widthInches: 72,
          heightInches: 42,
          depthInches: 78,
          summary: '78" Length x 72" Width x 42" Headboard Height',
        },
        customizable: true,
        limits: {
          minWidthInches: 60,
          maxWidthInches: 84,
          minHeightInches: 36,
          maxHeightInches: 54,
          minDepthInches: 72,
          maxDepthInches: 84,
        },
      },
      finishType: 'Natural Teak Melamine Polish',
      supportedFinishes: [
        'Natural Teak Melamine Polish',
        'Matte Polyurethane (PU)',
        'Italian High-Gloss PU',
        'Hand-Rubbed Spirit Polish',
      ],
      supportedSizes: [
        { id: 'king', label: 'King Size (78" x 72")', dimensionsSummary: '78" L x 72" W x 42" H' },
        { id: 'queen', label: 'Queen Size (78" x 60")', dimensionsSummary: '78" L x 60" W x 42" H', priceDiffPaise: -600000 },
        { id: 'single', label: 'Single Cot (78" x 36")', dimensionsSummary: '78" L x 36" W x 38" H', priceDiffPaise: -1600000 },
      ],
      isCustomizable: true,
      leadTimeWeeks: 3,
      availabilityLabel: 'Made to Order',
      inclusions: [
        '100% seasoned solid teakwood headboard, side rails, and footboard',
        'Heavy-duty hydraulic lifting gas struts (Ebco/Hettich rated for 60kg)',
        'BWP 710 marine plywood under-bed storage box with dust-seal lining',
        'White-glove delivery, room placement, and on-site assembly',
        '10-Year anti-termite and joinery craftsmanship warranty',
      ],
      exclusions: [
        'Mattress, pillows, and decorative soft bedding',
        'Concealed electrical wiring or internal LED strip lighting',
      ],
      hardwareSpecs: [
        'Ebco / Hettich 60kg rated hydraulic gas struts',
        'Zinc-plated M10 anti-loosening corner connector bolts',
        'Floor-protective high-density neoprene leg pads',
      ],
      deliveryNotice:
        'Complimentary delivery & assembly within Vuyyuru town, Vijayawada, and Guntur urban limits. Rural Krishna/NTR transport scheduled within 3–5 working days of workshop completion.',
      createdAt: '2026-01-15T09:00:00Z',
      internalNotes: 'Procure BWP ply from Sri Krishna Plywoods Vuyyuru.',
      supplierCostPaise: 3200000,
      grossMarginPercentage: 34.0,
    },
    {
      id: 'prod-teak-queen-cot',
      sku: 'VC-COT-QUEEN-02',
      name: 'Godavari Seasoned Teak Queen Bed',
      slug: 'godavari-seasoned-teak-queen-bed',
      shortDescription: 'Minimalist solid wood queen bed with hand-sanded curved headboard.',
      fullDescription:
        'A sleek, minimalist solid wood queen cot handcrafted from seasoned Ghana Teakwood. Features a subtle ergonomic incline on the solid headboard and heavy cross-braced solid timber mattress slats. Designed for durability and tropical moisture resistance without any artificial veneers or formaldehyde.',
      categoryId: 'cat-beds',
      categorySlug: 'beds',
      categoryName: 'Beds & Cots',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b4f?auto=format&fit=crop&w=800&q=80',
        alt: 'Minimalist queen bed in natural polished teak',
      },
      galleryImages: [
        {
          url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4b4f?auto=format&fit=crop&w=1200&q=80',
          alt: 'Minimalist queen bed in natural polished teak',
          caption: 'Handcrafted solid Ghana teak queen frame',
        },
        {
          url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
          alt: 'Headboard curve joinery detail',
          caption: 'Curved solid teak headboard with hidden fastening',
        },
      ],
      priceMode: 'starting_from',
      startingPricePaise: 3800000, // Starting from ₹38,000
      startingPrice: 38000,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['Seasoned Ghana Teak'],
      supportedWoodSpecies: ['Ghana Teakwood (Standard)', 'CP Teakwood (Upgrade)', 'Burma Teak (Heritage)'],
      dimensionsSummary: '78" L x 60" W x 38" H',
      dimensions: {
        standard: {
          widthInches: 60,
          heightInches: 38,
          depthInches: 78,
          summary: '78" Length x 60" Width x 38" Headboard Height',
        },
        customizable: true,
        limits: {
          minWidthInches: 48,
          maxWidthInches: 72,
          minHeightInches: 32,
          maxHeightInches: 48,
          minDepthInches: 70,
          maxDepthInches: 82,
        },
      },
      finishType: 'Matte Polyurethane (PU)',
      supportedFinishes: [
        'Matte Polyurethane (PU)',
        'Natural Teak Melamine Polish',
        'Raw Organic Wax Polish',
      ],
      supportedSizes: [
        { id: 'queen', label: 'Queen Size (78" x 60")', dimensionsSummary: '78" L x 60" W x 38" H' },
        { id: 'king', label: 'King Size (78" x 72")', dimensionsSummary: '78" L x 72" W x 40" H', priceDiffPaise: 700000 },
      ],
      isCustomizable: true,
      leadTimeWeeks: 3,
      availabilityLabel: 'Made to Order',
      inclusions: [
        'Solid Ghana teakwood framing with seasoned cross-battens',
        'Matte PU protective topcoat with scratch resistance',
        'On-site leveling and assembly in Krishna & Guntur districts',
        '5-Year anti-borer and craftsmanship warranty',
      ],
      exclusions: ['Under-bed storage drawers', 'Mattress and headboard cushion'],
      hardwareSpecs: ['Concealed high-tensile steel fasteners', 'Solid wood mortise pegs'],
      deliveryNotice: 'Standard delivery in 2–3 weeks across Vuyyuru, Vijayawada, and Guntur.',
      createdAt: '2026-02-10T10:00:00Z',
    },
    {
      id: 'prod-pooja-mandir',
      sku: 'VC-MND-01',
      name: 'Handcrafted Heritage Pooja Mandir',
      slug: 'handcrafted-heritage-pooja-mandir',
      shortDescription: 'Intricately carved temple unit with gopuram dome, brass bells, and incense drawer.',
      fullDescription:
        'A masterfully carved Hindu pooja mandapam built in strict accordance with traditional Vastu Shastra proportions. Features four solid teak turned pillars, an ornate Gopuram dome crown, hanging solid brass bells, stepped deity altar platforms, and a concealed drawer for camphor, oil, and puja essentials.',
      categoryId: 'cat-storage',
      categorySlug: 'storage',
      categoryName: 'Storage & Mandirs',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
        alt: 'Intricately crafted wooden mandir temple unit in seasoned teakwood',
      },
      galleryImages: [
        {
          url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
          alt: 'Heritage Pooja Mandir Main Front View',
          caption: 'Hand-carved solid teakwood mandir with gopuram dome',
        },
        {
          url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
          alt: 'Brass bell and pillar detail',
          caption: 'Cast brass bells and hand-turned solid teak columns',
        },
      ],
      priceMode: 'quote_required',
      startingPrice: null,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['Ghana Teakwood', 'Solid Teak Pillars'],
      supportedWoodSpecies: ['First-Grade Burma Teak', 'Ghana Teakwood', 'Country Teak'],
      dimensionsSummary: 'Customized to room vastu layout',
      dimensions: {
        standard: {
          widthInches: 48,
          heightInches: 66,
          depthInches: 24,
          summary: '48" Width x 66" Height x 24" Depth (Standard Vastu)',
        },
        customizable: true,
        limits: {
          minWidthInches: 36,
          maxWidthInches: 72,
          minHeightInches: 48,
          maxHeightInches: 96,
          minDepthInches: 18,
          maxDepthInches: 36,
        },
      },
      finishType: 'Antique Spirit Polish with Brass Bells',
      supportedFinishes: [
        'Antique Spirit Polish (Hand-Rubbed)',
        'Natural Teak Gloss Melamine',
        'Rosewood Stained Spirit Polish',
      ],
      isCustomizable: true,
      leadTimeWeeks: 4,
      availabilityLabel: 'Made to Order',
      inclusions: [
        'Authentic solid teak temple structure and deity altar steps',
        'Solid cast brass bells with brass chain suspension',
        'Pull-out brass-fitted prasad / incense shelf',
        'Vastu-compliant dimensions tailored to your prayer room space',
        'Care instructions and brass polishing guide',
      ],
      exclusions: ['Deity idols, lighting lamps, and wall mounting screws'],
      hardwareSpecs: ['Pure brass traditional handles and chain hooks', 'Soft-close bottom drawers'],
      deliveryNotice: 'Custom quotation includes site inspection in Vuyyuru/Vijayawada and safe room installation.',
      createdAt: '2026-01-20T11:00:00Z',
    },
    {
      id: 'prod-dining-table',
      sku: 'VC-TAB-DIN-01',
      name: 'Amaravati 6-Seater Solid Wood Dining Set',
      slug: 'amaravati-6-seater-solid-wood-dining-set',
      shortDescription: 'Generous 6-seater solid teak table accompanied by ergonomic cushioned chairs.',
      fullDescription:
        'A substantial family dining table hand-built from 1.5-inch thick seasoned teakwood planks. Accompanied by six solid teak chairs with ergonomic back slats and stain-resistant fabric cushions. Coated with heat and water-resistant Italian polyurethane finish to withstand daily Indian dining.',
      categoryId: 'cat-tables',
      categorySlug: 'tables',
      categoryName: 'Dining & Tables',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
        alt: 'Artisan handcrafted solid wood dining table with chairs',
      },
      galleryImages: [
        {
          url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
          alt: 'Amaravati 6-Seater Solid Wood Dining Set Top View',
          caption: 'Solid teak table top with natural grain matching',
        },
      ],
      priceMode: 'fixed',
      salePricePaise: 5600000, // ₹56,000
      startingPrice: 56000,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['Seasoned Teakwood', 'Neem wood sub-frame'],
      supportedWoodSpecies: ['Seasoned Teakwood', 'Burma Teak (Custom)'],
      dimensionsSummary: '72" L x 36" W x 30" H',
      dimensions: {
        standard: {
          widthInches: 36,
          heightInches: 30,
          depthInches: 72,
          summary: '72" Length x 36" Width x 30" Height',
        },
        customizable: true,
        limits: {
          minWidthInches: 30,
          maxWidthInches: 48,
          minHeightInches: 28,
          maxHeightInches: 32,
          minDepthInches: 48,
          maxDepthInches: 96,
        },
      },
      finishType: 'Polyurethane (PU) Matte Clear Coat',
      supportedFinishes: ['Polyurethane (PU) Matte Clear Coat', 'Gloss Teak Sealer'],
      isCustomizable: true,
      leadTimeWeeks: 3,
      availabilityLabel: 'Showroom Sample',
      inclusions: [
        '1x 6-Seater solid teak table',
        '6x Solid teak ergonomic dining chairs with cushion upholstery',
        'PU heat and stain protective barrier',
        'Direct doorstep delivery in Vuyyuru & Vijayawada',
      ],
      exclusions: ['Table runner and glassware'],
      hardwareSpecs: ['Corner mortise braces and zinc anchor bolts'],
      deliveryNotice: 'Showroom unit available for prompt inspection and delivery within 3 working days.',
      createdAt: '2026-01-25T14:30:00Z',
    },
    {
      id: 'prod-study-desk',
      sku: 'VC-TAB-DSK-02',
      name: 'Ergonomic Teak Study & Workstation Desk',
      slug: 'ergonomic-teak-study-desk',
      shortDescription: 'Solid wood executive desk with concealed cable duct and soft-close stationery drawers.',
      categoryId: 'cat-tables',
      categorySlug: 'tables',
      categoryName: 'Dining & Tables',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80',
        alt: 'Clean solid wood study table with drawers',
      },
      priceMode: 'starting_from',
      startingPricePaise: 2450000, // Starting from ₹24,500
      startingPrice: 24500,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['CP Teakwood', 'Ebco Channel Fittings'],
      supportedWoodSpecies: ['CP Teakwood', 'Ghana Teak'],
      dimensionsSummary: '48" L x 24" W x 30" H',
      dimensions: {
        standard: {
          widthInches: 24,
          heightInches: 30,
          depthInches: 48,
          summary: '48" Length x 24" Width x 30" Height',
        },
        customizable: true,
        limits: {
          minWidthInches: 20,
          maxWidthInches: 36,
          minHeightInches: 28,
          maxHeightInches: 32,
          minDepthInches: 36,
          maxDepthInches: 60,
        },
      },
      finishType: 'Satin Clear Sealer',
      supportedFinishes: ['Satin Clear Sealer', 'Dark Walnut Stain'],
      isCustomizable: true,
      leadTimeWeeks: 2,
      availabilityLabel: 'Made to Order',
      inclusions: ['Solid wood executive table', 'Two soft-close drawers with lock', 'Cable grommet port'],
      exclusions: ['Office chair and computer peripherals'],
      hardwareSpecs: ['Ebco telescopic drawer channels', 'Antique brass drawer pulls'],
      deliveryNotice: 'Made to order in 2 weeks.',
      createdAt: '2026-02-15T16:00:00Z',
    },
    {
      id: 'prod-modular-wardrobe',
      sku: 'VC-WRD-MOD-01',
      name: '4-Door Modular Wardrobe with Loft',
      slug: '4-door-modular-wardrobe-with-loft',
      shortDescription: 'Floor-to-ceiling fitted wardrobe carcass with customized drawers and hanger sections.',
      categoryId: 'cat-wardrobes',
      categorySlug: 'wardrobes',
      categoryName: 'Wardrobes & Closets',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
        alt: 'Modern wood grain wardrobe with soft-close handles',
      },
      priceMode: 'quote_required',
      startingPrice: null,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['Action TESA HDHMR', '1mm Merino Laminate'],
      supportedWoodSpecies: ['Action TESA HDHMR', 'Century BWP 710 Marine Ply', 'Solid Teak Fronts'],
      dimensionsSummary: '8ft Height x 7ft Width x 2ft Depth',
      dimensions: {
        standard: {
          widthInches: 84,
          heightInches: 96,
          depthInches: 24,
          summary: '8ft Height x 7ft Width x 2ft Depth',
        },
        customizable: true,
        limits: {
          minWidthInches: 48,
          maxWidthInches: 144,
          minHeightInches: 84,
          maxHeightInches: 120,
          minDepthInches: 22,
          maxDepthInches: 28,
        },
      },
      finishType: 'Textured Oak & Matte Grey Laminate',
      supportedFinishes: ['Textured Oak & Matte Grey Laminate', 'High-Gloss Acrylic', 'Natural Wood Veneer'],
      isCustomizable: true,
      leadTimeWeeks: 2,
      availabilityLabel: 'Made to Order',
      inclusions: ['Custom carcass internal layout', 'Soft-close hinges and drawer runners', 'Full loft storage section'],
      exclusions: ['Internal LED strip sensor fixtures (optional extra)'],
      hardwareSpecs: ['Blum / Hettich soft-close clip-on hinges', 'Heavy-duty hanging rails'],
      deliveryNotice: 'Custom wardrobe installation scheduled after on-site laser survey.',
      createdAt: '2026-02-01T12:00:00Z',
    },
    {
      id: 'prod-sliding-wardrobe',
      sku: 'VC-WRD-SLD-02',
      name: 'Contemporary 2-Track Sliding Wardrobe',
      slug: 'contemporary-2-track-sliding-wardrobe',
      shortDescription: 'Space-saving sliding shutter wardrobe with tinted glass and fluted laminate detailing.',
      categoryId: 'cat-wardrobes',
      categorySlug: 'wardrobes',
      categoryName: 'Wardrobes & Closets',
      primaryImage: null, // Deliberate null image to test designed fallback component!
      priceMode: 'quote_required',
      startingPrice: null,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['Century BWP 18mm Ply', 'Hafele Slider Tracks'],
      supportedWoodSpecies: ['Century BWP 18mm Ply', 'Action TESA HDHMR'],
      dimensionsSummary: '7ft Height x 6ft Width x 26" Depth',
      dimensions: {
        standard: {
          widthInches: 72,
          heightInches: 84,
          depthInches: 26,
          summary: '7ft Height x 6ft Width x 26" Depth',
        },
        customizable: true,
        limits: {
          minWidthInches: 60,
          maxWidthInches: 120,
          minHeightInches: 78,
          maxHeightInches: 108,
          minDepthInches: 24,
          maxDepthInches: 30,
        },
      },
      finishType: 'Warm Oak Veneer & Bronze Mirror',
      supportedFinishes: ['Warm Oak Veneer & Bronze Mirror', 'Fluted Charcoal & Gold Trim'],
      isCustomizable: true,
      leadTimeWeeks: 3,
      availabilityLabel: 'Made to Order',
      inclusions: ['Dual track sliding mechanism with dampers', 'Internal shelf and drawer organizers'],
      exclusions: ['Wall skirting civil alteration'],
      hardwareSpecs: ['Hafele sliding door track dampers'],
      deliveryNotice: 'Fabricated at Vuyyuru workshop and assembled in bedroom.',
      createdAt: '2026-02-05T15:00:00Z',
    },
    {
      id: 'prod-teak-main-door',
      sku: 'VC-DOR-MAIN-01',
      name: 'Grand Carved Teak Main Entrance Door',
      slug: 'grand-carved-teak-main-entrance-door',
      shortDescription: 'Heavy-gauge solid teak entry door featuring carved lotus architrave and solid frame.',
      categoryId: 'cat-doors',
      categorySlug: 'doors',
      categoryName: 'Doors & Frames',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        alt: 'Solid teakwood entrance door with architectural relief framing',
      },
      priceMode: 'quote_required',
      startingPrice: null,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['Burma Teak', 'Heavy Brass Hardware'],
      supportedWoodSpecies: ['Burma Teak (38mm thick)', 'CP Teak (45mm thick)'],
      dimensionsSummary: '7ft x 3.5ft x 38mm thickness',
      dimensions: {
        standard: {
          widthInches: 42,
          heightInches: 84,
          depthInches: 2,
          summary: '7ft Height x 3.5ft Width x 38mm Thickness',
        },
        customizable: true,
        limits: {
          minWidthInches: 36,
          maxWidthInches: 60,
          minHeightInches: 78,
          maxHeightInches: 96,
          minDepthInches: 1.5,
          maxDepthInches: 2.5,
        },
      },
      finishType: 'Hand-Polished High Gloss PU',
      supportedFinishes: ['Hand-Polished High Gloss PU', 'Matte Italian Sealer', 'Heritage Dark Spirit Polish'],
      isCustomizable: true,
      leadTimeWeeks: 3,
      availabilityLabel: 'Made to Order',
      inclusions: ['Solid teak carved shutter', 'Solid teak door frame (chaoukat)', 'Heavy solid brass aldrop & handle'],
      exclusions: ['Civil masonry anchoring (carpentry fixing included)'],
      hardwareSpecs: ['Solid brass traditional hinges and security tower bolts'],
      deliveryNotice: 'Requires on-site opening measurement verification prior to timber cutting.',
      createdAt: '2026-01-10T08:00:00Z',
    },
    {
      id: 'prod-modular-kitchen',
      sku: 'VC-KIT-MOD-01',
      name: 'BWP Marine Ply Modular Kitchen Layout',
      slug: 'bwp-marine-ply-modular-kitchen',
      shortDescription: 'Waterproof kitchen joinery with tandem soft-close baskets, pantry tall unit, and chimney box.',
      categoryId: 'cat-kitchens',
      categorySlug: 'kitchens',
      categoryName: 'Modular Kitchens',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
        alt: 'Sleek wood and acrylic modular kitchen with pull-out drawers',
      },
      priceMode: 'quote_required',
      startingPrice: null,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['Century Club Prime BWP 710 Ply', 'Acrylic Shutters'],
      supportedWoodSpecies: ['Century Club Prime BWP 710 Ply', 'Action TESA HDHMR'],
      dimensionsSummary: 'L-Shape / Parallel layout customized to site',
      dimensions: {
        standard: {
          widthInches: 120,
          heightInches: 84,
          depthInches: 24,
          summary: 'L-Shape or Parallel layout customized to site slabs',
        },
        customizable: true,
      },
      finishType: 'Water-resistant acrylic with Hettich Soft-Close',
      supportedFinishes: ['Anti-Fingerprint Matte Acrylic', 'High-Gloss Acrylic', 'PU Coated Veneer'],
      isCustomizable: true,
      leadTimeWeeks: 4,
      availabilityLabel: 'Made to Order',
      inclusions: ['Waterproof carcass joinery', 'Stainless steel tandem baskets', 'Chimney framing casing'],
      exclusions: ['Granite countertop, chimney appliance, and sink fitting'],
      hardwareSpecs: ['Blum / Hettich tandem runners with lifetime smooth-slide warranty'],
      deliveryNotice: 'Requires 2-step site laser measurement survey in Vuyyuru/Vijayawada.',
      createdAt: '2026-01-18T13:00:00Z',
    },
    {
      id: 'prod-crockery-cabinet',
      sku: 'VC-STG-CRK-02',
      name: 'Heritage Glass & Teak Crockery Cabinet',
      slug: 'heritage-glass-teak-crockery-cabinet',
      shortDescription: 'Tall display cabinet with toughened fluted glass doors and warm internal LED spotlighting.',
      categoryId: 'cat-storage',
      categorySlug: 'storage',
      categoryName: 'Storage & Mandirs',
      primaryImage: {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
        alt: 'Teakwood crockery storage unit with glass paneling',
      },
      priceMode: 'starting_from',
      startingPricePaise: 3200000, // Starting from ₹32,000
      startingPrice: 32000,
      currency: 'INR',
      status: 'active',
      visibility: 'public',
      woodSpecies: ['Seasoned Teak', 'Fluted Glass'],
      supportedWoodSpecies: ['Seasoned Teak', 'Ghana Teak'],
      dimensionsSummary: '6.5ft Height x 4ft Width x 18" Depth',
      dimensions: {
        standard: {
          widthInches: 48,
          heightInches: 78,
          depthInches: 18,
          summary: '6.5ft Height x 4ft Width x 18" Depth',
        },
        customizable: true,
        limits: {
          minWidthInches: 36,
          maxWidthInches: 60,
          minHeightInches: 66,
          maxHeightInches: 84,
          minDepthInches: 15,
          maxDepthInches: 22,
        },
      },
      finishType: 'Warm Honey Polish',
      supportedFinishes: ['Warm Honey Polish', 'Antique Spirit Polish', 'Walnut Matte Finish'],
      isCustomizable: true,
      leadTimeWeeks: 3,
      availabilityLabel: 'Made to Order',
      inclusions: ['Solid teak framing', 'Toughened fluted glass shutters', 'Internal storage shelves and cutlery drawers'],
      exclusions: ['Glassware and decorative china'],
      hardwareSpecs: ['Concealed soft-close hinges', 'Brass slimline handles'],
      deliveryNotice: 'Carefully wrapped and transported with edge protectors.',
      createdAt: '2026-02-12T11:00:00Z',
    },
    // -------------------------------------------------------------
    // Test Records: MUST NEVER APPEAR IN PUBLIC STOREFRONT
    // -------------------------------------------------------------
    {
      id: 'prod-secret-draft',
      sku: 'VC-INTERNAL-01',
      name: 'Unfinished Experimental Chair Prototype',
      slug: 'unfinished-experimental-chair',
      shortDescription: 'Prototype workshop piece under testing.',
      categoryId: 'cat-tables',
      categorySlug: 'tables',
      categoryName: 'Dining & Tables',
      primaryImage: null,
      priceMode: 'quote_required',
      startingPrice: null,
      currency: 'INR',
      status: 'draft', // DRAFT - Exclude!
      visibility: 'public',
      internalNotes: 'Draft not ready for clients.',
    },
    {
      id: 'prod-private-custom-job',
      sku: 'VC-PVT-02',
      name: 'Private Client Bespoke Wardrobe',
      slug: 'private-client-bespoke-wardrobe',
      shortDescription: 'Custom one-off job for private residence.',
      categoryId: 'cat-wardrobes',
      categorySlug: 'wardrobes',
      categoryName: 'Wardrobes & Closets',
      primaryImage: null,
      priceMode: 'quote_required',
      startingPrice: null,
      currency: 'INR',
      status: 'active',
      visibility: 'private', // PRIVATE - Exclude!
      internalNotes: 'Do not publish.',
    },
  ];

/**
 * Filter Engine: Returns strictly public, active products, omitting all admin-only properties.
 */
export function queryPublicProducts(params: {
  category?: string;
  priceMode?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): {
  items: PublicProduct[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  filters: Record<string, any>;
} {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(48, Math.max(1, params.limit || 12));

  // 1. Core Rule: Only active and public
  let filtered = masterProductDatabase
    .filter((p) => p.status === 'active' && p.visibility === 'public')
    .map((p) => {
      // Strip any internal fields
      const { internalNotes, supplierCostPaise, grossMarginPercentage, ...clean } = p;
      return clean as PublicProduct;
    });

  // 2. Category filter
  if (params.category && params.category !== 'all') {
    filtered = filtered.filter(
      (p) => p.categorySlug.toLowerCase() === params.category?.toLowerCase()
    );
  }

  // 3. Price Mode filter
  if (params.priceMode && params.priceMode !== 'all') {
    filtered = filtered.filter((p) => p.priceMode === params.priceMode);
  }

  // 4. Comparable Price Range filter (applies only to fixed or starting_from items with numeric prices)
  if (params.priceMin !== undefined && !isNaN(params.priceMin)) {
    const minPaise = params.priceMin * 100;
    filtered = filtered.filter((p) => {
      const pricePaise = p.salePricePaise ?? p.startingPricePaise;
      return pricePaise !== undefined && pricePaise >= minPaise;
    });
  }

  if (params.priceMax !== undefined && !isNaN(params.priceMax)) {
    const maxPaise = params.priceMax * 100;
    filtered = filtered.filter((p) => {
      const pricePaise = p.salePricePaise ?? p.startingPricePaise;
      return pricePaise !== undefined && pricePaise <= maxPaise;
    });
  }

  // 5. Keyword search filter
  if (params.search && params.search.trim()) {
    const q = params.search.trim().toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q) ||
        p.woodSpecies?.some((w) => w.toLowerCase().includes(q))
    );
  }

  // 6. Sort control (allow-listed)
  const sort = params.sort || 'recommended';
  switch (sort) {
    case 'newest':
      filtered.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      break;
    case 'name_asc':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'price_asc':
      // Sort comparable prices only; quote_required placed at end
      filtered.sort((a, b) => {
        const pA = a.salePricePaise ?? a.startingPricePaise ?? Number.MAX_SAFE_INTEGER;
        const pB = b.salePricePaise ?? b.startingPricePaise ?? Number.MAX_SAFE_INTEGER;
        return pA - pB;
      });
      break;
    case 'price_desc':
      filtered.sort((a, b) => {
        const pA = a.salePricePaise ?? a.startingPricePaise ?? -1;
        const pB = b.salePricePaise ?? b.startingPricePaise ?? -1;
        return pB - pA;
      });
      break;
    case 'recommended':
    default:
      // Preserves curated showcase ordering
      break;
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return {
    items,
    page,
    limit,
    total,
    totalPages,
    filters: {
      category: params.category,
      priceMode: params.priceMode,
      priceMin: params.priceMin,
      priceMax: params.priceMax,
      search: params.search,
      sort,
    },
  };
}

export function getPublicFilterOptions(): ProductFilterOptions {
  const activeProducts = masterProductDatabase.filter(
    (p) => p.status === 'active' && p.visibility === 'public'
  );

  const categories = verifiedCategories.map((c) => ({
    slug: c.slug,
    name: c.name,
    count: activeProducts.filter((p) => p.categorySlug === c.slug).length,
  }));

  const priceModes: { mode: any; label: string; count: number }[] = [
    {
      mode: 'fixed',
      label: 'Fixed Price',
      count: activeProducts.filter((p) => p.priceMode === 'fixed').length,
    },
    {
      mode: 'starting_from',
      label: 'Starting From Price',
      count: activeProducts.filter((p) => p.priceMode === 'starting_from').length,
    },
    {
      mode: 'quote_required',
      label: 'Custom Quote Required',
      count: activeProducts.filter((p) => p.priceMode === 'quote_required').length,
    },
  ];

  // Derive comparable price bounds in Rupees
  const validPricesRupees = activeProducts
    .map((p) => (p.salePricePaise ?? p.startingPricePaise ? (p.salePricePaise ?? p.startingPricePaise)! / 100 : null))
    .filter((p): p is number => p !== null);

  const priceBounds = {
    min: validPricesRupees.length > 0 ? Math.min(...validPricesRupees) : 20000,
    max: validPricesRupees.length > 0 ? Math.max(...validPricesRupees) : 80000,
  };

  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'newest', label: 'Newest Additions' },
    { value: 'name_asc', label: 'Name (A to Z)' },
    { value: 'price_asc', label: 'Price (Low to High)' },
    { value: 'price_desc', label: 'Price (High to Low)' },
  ];

  return {
    categories,
    priceModes,
    priceBounds,
    sortOptions,
  };
}

export const verifiedFeaturedProducts = masterProductDatabase
  .filter((p) => p.status === 'active' && p.visibility === 'public')
  .slice(0, 6);

// -------------------------------------------------------------
// Approved Public Projects Database (Screen 07)
// Privacy Rule: Only published projects with photoPermissionStatus = 'approved'
// Exclude customer names, phone numbers, exact addresses, and quotation figures.
// -------------------------------------------------------------
export const masterProjectsDatabase: PublicProject[] = [
  {
    id: 'proj-01',
    title: 'Custom Teakwood Living & Mandir Suite',
    slug: 'vuyyuru-residence-teak-suite',
    category: 'furniture',
    summary: 'Handcrafted seasoned Burma teakwood pooja mandir and living room low diwan set with traditional Andhra floral carvings.',
    description: 'Commissioned for a multi-generational home in Vuyyuru. The suite incorporates seasoned Burma teakwood framing, brass bell mounts, soft velvet backings, and concealed LED driver channels for sacred lighting. Precision mortise-and-tenon joinery ensures multigenerational durability without exposed fasteners.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        alt: 'Handcrafted teakwood pooja mandir with hand-carved gopuram archway in Vuyyuru residence',
        kind: 'finished',
      },
      {
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
        alt: 'Detail of interlocking teak joints and hand-rubbed melamine finish',
        kind: 'finished',
      },
    ],
    generalArea: 'Vuyyuru',
    location: 'Vuyyuru Town',
    year: 2026,
    completedAt: 'January 2026',
    materialsUsed: ['Burma Teakwood (Grade 1)', 'Marine Grade Plywood', 'Solid Brass Finials', 'Melamine Natural Polish'],
    scopeHighlights: [
      'Site laser dimensions and vastu-compliant orientation alignment',
      'Workshop pre-fabrication with full mortise-and-tenon structural framing',
      'Concealed wiring chases for pooja spotlighting and brass diya trays',
      'Multi-coat hand-rubbed natural teak finish with sealer coat',
    ],
    clientFeedbackQuote: 'The traditional joinery and carved gopuram work exceeded our expectations. The workshop team respected our pooja timing and left the room spotless.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
      alt: 'Pooja mandir wood carving work in Vuyyuru residence',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'approved',
    photoPermissionGranted: true,
  },
  {
    id: 'proj-02',
    title: 'Modular BWP Marine Ply Kitchen & Acrylic Pantry',
    slug: 'vijayawada-penthouse-kitchen',
    category: 'interiors',
    summary: 'Full modular kitchen layout featuring IS:710 Marine BWP carcass, anti-fingerprint acrylic shutters, and tandem soft-close drawers.',
    description: 'Designed and installed for a modern apartment in Vijayawada. Built to withstand tropical coastal humidity using boiling water proof marine plywood (710 grade) with heavy-duty edge-banding and German-engineered soft-close drawer runners.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Completed modular kitchen joinery with quartz countertops in Vijayawada',
        kind: 'finished',
      },
      {
        url: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80',
        alt: 'Pantry roll-out units and internal organizer layout',
        kind: 'finished',
      },
    ],
    generalArea: 'Vijayawada',
    location: 'Benz Circle, Vijayawada',
    year: 2026,
    completedAt: 'February 2026',
    materialsUsed: ['Action TESA HDHMR', 'IS:710 Marine Grade BWP Plywood', 'Hettich Quadro Runners', 'Anti-Fingerprint Acrylic'],
    scopeHighlights: [
      'Comprehensive 3D carcass layout & plumb-line laser measurement',
      'Boiling Water Proof marine ply base units to prevent sink-leak swelling',
      'Dual pantry tall units with wire baskets and soft-close spice pullouts',
      'Seamless 2mm PVC edge-banding sealed with polyurethane hot-melt adhesive',
    ],
    clientFeedbackQuote: 'Zero water seepage issues even around the sink area. The Hettich drawer glides are smooth and silent.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      alt: 'Completed modular kitchen joinery in Vijayawada',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'approved',
    photoPermissionGranted: true,
  },
  {
    id: 'proj-03',
    title: 'Solid Teak Entrance Architrave & Panel Doors',
    slug: 'guntur-villa-teak-doors',
    category: 'doors',
    summary: 'Heavy 45mm solid teak main double doors with traditional engraved border frames and solid brass mortise hardware.',
    description: 'Grand entrance double door crafted for an independent residence in Guntur. Utilizing seasoned Ghana teak planks kiln-dried to under 12% moisture content to resist warping during dry summer and monsoon cycles.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Solid teakwood door installed on site with brass handles in Guntur',
        kind: 'finished',
      },
    ],
    generalArea: 'Guntur',
    location: 'Kanna Thota, Guntur',
    year: 2025,
    completedAt: 'December 2025',
    materialsUsed: ['Ghana Teakwood (45mm thick)', 'Melamine Matte Sealer', 'Antique Brass Handles & Euro Mortise Lock'],
    scopeHighlights: [
      'Double rebate seasoned teak jambs anchored to masonry with expansion bolts',
      'Raised-and-fielded solid panels joined with tongue-and-groove tolerance',
      'Multi-coat weather-resistant matte polyurethane topcoat',
      'Precision mortise cutouts for multi-point lock and brass tower bolts',
    ],
    clientFeedbackQuote: 'The door has a reassuring heft and closes with a satisfying solid thud. The brass hardware compliments the teak grain.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      alt: 'Solid teakwood door installed on site in Guntur',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'approved',
    photoPermissionGranted: true,
  },
  {
    id: 'proj-04',
    title: 'Full-Height Floor-to-Ceiling Teak Finish Wardrobe with Loft',
    slug: 'vuyyuru-floor-to-ceiling-wardrobe',
    category: 'wardrobes',
    summary: 'Seamless 9-foot master bedroom wardrobe with integrated overhead loft storage and natural teak veneer facings.',
    description: 'Custom fitted wardrobe tailored to ceiling beams in a Vuyyuru rural residence. Features concealed soft-close hinges, internal tie racks, lockable jewelry drawers with felt lining, and full-depth upper lofts for seasonal bedding.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
        alt: 'Fitted modern bedroom wardrobe with natural teak veneer and integrated loft',
        kind: 'finished',
      },
      {
        url: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=1200&q=80',
        alt: 'Internal drawer layout and adjustable shelving detail',
        kind: 'finished',
      },
    ],
    generalArea: 'Vuyyuru',
    location: 'Vuyyuru Rural',
    year: 2026,
    completedAt: 'January 2026',
    materialsUsed: ['Century Marine Grade Plywood', 'Natural Teak Veneer (3.5mm)', 'Blum Soft-Close Hinges', 'Satin Polish'],
    scopeHighlights: [
      'Floor-to-ceiling framing accommodating slight ceiling slopes without gaps',
      'Matching grain continuation across lower shutters and upper loft doors',
      'Internal dedicated saree organizers and heavy-duty chrome hanging rails',
      'Dust-seal perimeter brushes to protect clothing against rural summer dust',
    ],
    clientFeedbackQuote: 'Maximum utilization of our 9-foot ceiling. The loft fits all our festive bedding and suitcases perfectly.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
      alt: 'Full height teak finish wardrobe with overhead loft storage in Vuyyuru',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'approved',
    photoPermissionGranted: true,
  },
  {
    id: 'proj-05',
    title: 'Antique Rosewood Diwan Restoration & Structural Joinery',
    slug: 'tenali-antique-rosewood-restoration',
    category: 'repairs',
    summary: 'Restoration of a 45-year-old family heirloom rosewood diwan with repaired tenons, termite-treated framing, and traditional French polish.',
    description: 'A delicate conservation project from Tenali. The antique piece suffered from split side rails and loose tenons. Our master artisan disassembled the frame, re-glued the structural joints with historic hide glue, treated non-structural areas for insect prevention, and hand-rubbed 6 coats of traditional shellac French polish.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        alt: 'Fully restored antique rosewood diwan with mirror-like hand French polish in Tenali',
        kind: 'after',
      },
      {
        url: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
        alt: 'Original antique diwan before restoration showing cracked side rails and weathered finish',
        kind: 'before',
      },
    ],
    generalArea: 'Tenali',
    location: 'Tenali Town',
    year: 2025,
    completedAt: 'November 2025',
    materialsUsed: ['Seasoned Indian Rosewood (Dalbergia)', 'Traditional Hide Glue', 'Dewaxed Button Shellac', 'Natural Beeswax'],
    scopeHighlights: [
      'Non-destructive disassembly and numbered timber marking',
      'Tenon re-wedging and micro-dowel reinforcement without modern metal screws',
      'Gentle hand-stripping of degraded varnish without removing age patina',
      'Multi-coat spiriting-off French polish application',
    ],
    clientFeedbackQuote: 'Our grandfather’s diwan looks magnificent again. We are grateful that the original woodwork character was lovingly preserved.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80',
      alt: 'Restored antique rosewood diwan after workshop joinery',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'approved',
    photoPermissionGranted: true,
  },
  {
    id: 'proj-06',
    title: 'Handcrafted 8-Seater Burma Teak Dining Table & Benches',
    slug: 'vijayawada-dining-suite',
    category: 'furniture',
    summary: 'Substantial solid teak dining table with two matched benches featuring chamfered edges and heat-resistant polyurethane finish.',
    description: 'Custom built for a spacious dining area in Vijayawada. Planks were hand-selected for deep honey-amber grain, joined with concealed biscuit joints, and supported by heavy trestle bases engineered for zero table wobble.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
        alt: 'Handcrafted solid teakwood dining table and matching bench set in Vijayawada',
        kind: 'finished',
      },
    ],
    generalArea: 'Vijayawada',
    location: 'MG Road, Vijayawada',
    year: 2025,
    completedAt: 'October 2025',
    materialsUsed: ['100% Solid Seasoned Burma Teak (38mm table top)', 'Polyurethane Heat-Resistant Matte Polish'],
    scopeHighlights: [
      'Edge-glued 38mm solid teak slab with underside expansion relief slots',
      'Heavy timber trestle base joined with pinned through-mortise tenons',
      'Dual matching solid benches with recessed finger grips for easy tuck-in',
      'Heat and moisture resistant finish tested for hot curry bowls',
    ],
    clientFeedbackQuote: 'Solid as a rock with no creaks or wobble. Comfortably seats our extended family during festival gatherings.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
      alt: 'Handcrafted solid teakwood dining table in Vijayawada',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'approved',
    photoPermissionGranted: true,
  },
  {
    id: 'proj-07',
    title: 'Traditional Carved Teakwood Temple Mandir with Brass Inlay',
    slug: 'kankipadu-heritage-mandir',
    category: 'interiors',
    summary: 'Intricate temple sanctuary with hand-carved pillars, floral jali side panels, and brass inlay base steps.',
    description: 'Created for a devout household in Kankipadu. Features authentic Dravidian temple tower (shikhara) proportions, carved peacock motifs, and pull-out prasadam drawer with brass flower inlays.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
        alt: 'Intricate carved teakwood mandir sanctuary installed in Kankipadu residence',
        kind: 'finished',
      },
    ],
    generalArea: 'Kankipadu',
    location: 'Kankipadu Town',
    year: 2026,
    completedAt: 'January 2026',
    materialsUsed: ['Burma Teakwood (Grade 1)', 'Solid Sheet Brass Inlay', 'Pure Linseed Oil & Melamine Coat'],
    scopeHighlights: [
      'Carved temple pillars turned on workshop lathes with spiral fluting',
      'Jali screens designed for ventilation while maintaining sacred privacy',
      'Concealed roller runners for heavy brass diya pull-out platform',
      'Smoke and incense resistant protective sealer on ceiling interior',
    ],
    clientFeedbackQuote: 'A serene and divine addition to our home. The carving details on the pillars are exceptionally fine.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=800&q=80',
      alt: 'Carved teakwood temple mandir in Kankipadu',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'approved',
    photoPermissionGranted: true,
  },
  {
    id: 'proj-08',
    title: 'Fluted Teak Double French Doors with Beveled Glass',
    slug: 'mangalagiri-fluted-doors',
    category: 'doors',
    summary: 'Contemporary fluted teak interior partition doors with clear beveled glass inserts and concealed floor spring hinges.',
    description: 'Separating living and dining zones in a Mangalagiri villa. Combines contemporary vertical fluted woodwork with acoustic perimeter gaskets and solid brass pivot hardware.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Fluted teak double doors installed with brass pivot hinges in Mangalagiri',
        kind: 'finished',
      },
    ],
    generalArea: 'Mangalagiri',
    location: 'Mangalagiri',
    year: 2025,
    completedAt: 'September 2025',
    materialsUsed: ['Seasoned Teakwood', '8mm Toughened Beveled Glass', 'German Floor Spring Pivots'],
    scopeHighlights: [
      'Precision CNC-routed vertical flute patterns with hand-sanded edges',
      'Dual-swing concealed floor pivot hinges allowing 180-degree clearance',
      'Acoustic silicone buffer seals integrated into jamb rebates',
      'Clear matte polyurethane finish preserving raw teak tone',
    ],
    clientFeedbackQuote: 'Provides separation without cutting out natural daylight. The doors swing smoothly with one gentle touch.',
    coverImage: {
      url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
      alt: 'Fluted teak double doors in Mangalagiri',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'approved',
    photoPermissionGranted: true,
  },
  // -------------------------------------------------------------
  // Privacy & Status Filtering Verification Items:
  // These MUST NEVER appear in public endpoints or gallery views!
  // -------------------------------------------------------------
  {
    id: 'proj-private-draft',
    title: 'Private Custom Dressing Room Wardrobe (Draft Scope)',
    slug: 'private-draft-wardrobe',
    category: 'wardrobes',
    summary: 'Internal draft project record pending customer photography release.',
    description: 'CONFIDENTIAL: Internal workshop notes and pre-installation photos. Customer consent not yet approved.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80',
        alt: 'Confidential internal photo',
        kind: 'finished',
      },
    ],
    generalArea: 'Vijayawada',
    location: 'Confidential',
    year: 2026,
    materialsUsed: ['Commercial Ply'],
    coverImage: {
      url: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&w=800&q=80',
      alt: 'Confidential photo',
    },
    publicationStatus: 'draft',
    photoPermissionStatus: 'pending',
    photoPermissionGranted: false,
  },
  {
    id: 'proj-private-denied',
    title: 'Executive Conference Room Table (Consent Denied)',
    slug: 'private-denied-conference-table',
    category: 'furniture',
    summary: 'Client declined photo publication permission due to private facility policy.',
    description: 'CONFIDENTIAL: Commercial project with NDA.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
        alt: 'Confidential table',
        kind: 'finished',
      },
    ],
    generalArea: 'Guntur',
    location: 'Confidential',
    year: 2025,
    materialsUsed: ['Teakwood'],
    coverImage: {
      url: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80',
      alt: 'Confidential photo',
    },
    publicationStatus: 'published',
    photoPermissionStatus: 'denied',
    photoPermissionGranted: false,
  },
];

// Helper: Query public projects with strict privacy filtering & pagination
export function queryPublicProjects(params: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): ProjectListResponse {
  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, Math.min(50, params.limit || 12));
  const categoryFilter = params.category?.toLowerCase().trim();
  const searchFilter = params.search?.toLowerCase().trim();

  // Strict Publication & Privacy Rule:
  // Only published items with approved photo permission status
  let filtered = masterProjectsDatabase.filter(
    (p) => p.publicationStatus === 'published' && p.photoPermissionStatus === 'approved'
  );

  // Category filter
  if (categoryFilter && categoryFilter !== 'all') {
    filtered = filtered.filter((p) => {
      const cat = p.category.toLowerCase();
      if (categoryFilter === 'furniture') return cat.includes('furniture');
      if (categoryFilter === 'doors') return cat.includes('door');
      if (categoryFilter === 'wardrobes') return cat.includes('wardrobe') || cat.includes('storage');
      if (categoryFilter === 'interiors') return cat.includes('interior') || cat.includes('kitchen') || cat.includes('mandir');
      if (categoryFilter === 'repairs') return cat.includes('repair') || cat.includes('restoration');
      return cat === categoryFilter;
    });
  }

  // Search filter
  if (searchFilter) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(searchFilter) ||
        p.summary.toLowerCase().includes(searchFilter) ||
        (p.generalArea && p.generalArea.toLowerCase().includes(searchFilter)) ||
        p.materialsUsed.some((m) => m.toLowerCase().includes(searchFilter))
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 0;
  const startIndex = (page - 1) * limit;
  const items = filtered.slice(startIndex, startIndex + limit);

  return {
    items,
    page,
    limit,
    total,
    totalPages,
    filters: {
      category: params.category,
      search: params.search,
    },
  };
}

// Helper: Get single project by slug with strict privacy check
export function getPublicProjectBySlug(slug: string): PublicProject | null {
  const project = masterProjectsDatabase.find((p) => p.slug === slug);
  if (!project) return null;
  // Privacy Rule: reject if draft or consent not approved
  if (project.publicationStatus !== 'published' || project.photoPermissionStatus !== 'approved') {
    return null;
  }
  return project;
}

// Backward-compatibility export for existing components and tests
export const verifiedFeaturedProjects: PublicProject[] = masterProjectsDatabase
  .filter((p) => p.publicationStatus === 'published' && p.photoPermissionStatus === 'approved')
  .slice(0, 3);


// -------------------------------------------------------------
// Approved Public Searchable Services
// -------------------------------------------------------------
export interface SearchableServiceItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  route: string;
  iconName: string;
  categoryName: string;
}

export const searchableServicesDatabase: SearchableServiceItem[] = [
  {
    id: 'srv-repairs',
    title: 'Carpentry Repairs & Hardware Maintenance',
    slug: 'repairs',
    summary:
      'Door alignment, squeaking hinges, loose joinery, lock replacement, and termite damage inspection in Vuyyuru, Vijayawada, and nearby areas.',
    route: '/services#repairs',
    iconName: 'Hammer',
    categoryName: 'Repairs & Maintenance',
  },
  {
    id: 'srv-custom-furniture',
    title: 'Bespoke Solid Teakwood Furniture Fabrication',
    slug: 'custom-furniture',
    summary:
      'Handcrafted made-to-measure dining sets, king cots, diwans, and carved pooja mandirs using seasoned Burma and CP teakwood with milestone contracts.',
    route: '/custom-furniture',
    iconName: 'Sofa',
    categoryName: 'Custom Furniture',
  },
  {
    id: 'srv-doors-frames',
    title: 'Main Entrance Teak Doors & Architraves',
    slug: 'doors',
    summary:
      'Heavy-gauge solid teak main doors with traditional floral/temple carvings, brass fixtures, and natural veneer flush internal doors.',
    route: '/products?category=doors',
    iconName: 'DoorClosed',
    categoryName: 'Doors & Frames',
  },
  {
    id: 'srv-kitchens',
    title: 'BWP Marine Ply Modular Kitchen Joinery',
    slug: 'kitchens',
    summary:
      'Waterproof BWP 710 marine plywood carcasses, soft-close Blum/Hettich tandem runners, and acrylic/laminate shutters customized to site slabs.',
    route: '/products?category=kitchens',
    iconName: 'Utensils',
    categoryName: 'Modular Kitchens',
  },
  {
    id: 'srv-finishing',
    title: 'Wood Polishing, Melamine & Italian PU Finishing',
    slug: 'finishing',
    summary:
      'Hand-rubbed spirit polish, Italian Polyurethane (PU) spray coating in high-gloss and matte, melamine wood sealing, and vintage furniture restoration.',
    route: '/services#finishing',
    iconName: 'Sparkles',
    categoryName: 'Finishing & Polishing',
  },
  {
    id: 'srv-site-visit',
    title: 'Laser Site Survey & Room Measurement Visit',
    slug: 'site-visit',
    summary:
      'On-site laser measurements in Vuyyuru, Vijayawada, and Guntur to verify wall squareness, floor levels, and electrical points before quotation.',
    route: '/visit-request',
    iconName: 'Ruler',
    categoryName: 'Consultation & Survey',
  },
];

/**
 * Unified Search Engine (Screen 03)
 * Searches published products, active categories, and approved services.
 * Strictly excludes drafts, private commissions, and internal admin data.
 */
export function queryUnifiedSearch(params: {
  q?: string;
  type?: 'all' | 'products' | 'services';
  page?: number;
  limit?: number;
}) {
  const rawQ = (params.q || '').trim();
  // Safe truncation to 100 characters to prevent overflow / abuse
  const cleanQ = rawQ.slice(0, 100).toLowerCase();
  const searchType = params.type || 'all';
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(48, Math.max(1, params.limit || 12));

  // If query is empty, return empty result state with popular suggestions
  if (!cleanQ) {
    return {
      query: '',
      type: searchType,
      items: [],
      page: 1,
      limit,
      total: 0,
      totalPages: 0,
      counts: { all: 0, products: 0, services: 0 },
      matchedCategories: [],
      suggestions: [
        'Teak king bed',
        'Pooja mandir',
        'Solid dining table',
        'Modular wardrobe',
        'Teak entrance door',
        'Modular kitchen',
        'Carpentry repairs',
      ],
    };
  }

  // 1. Search Products (published and public only!)
  const scoredProducts: { item: any; score: number }[] = [];
  const publicActiveProducts = masterProductDatabase.filter(
    (p) => p.status === 'active' && p.visibility === 'public'
  );

  publicActiveProducts.forEach((p) => {
    let score = 0;
    const nameLower = p.name.toLowerCase();
    const descLower = p.shortDescription.toLowerCase();
    const catLower = p.categoryName.toLowerCase();
    const skuLower = (p.sku || '').toLowerCase();

    // Exact title match gets highest priority (+100)
    if (nameLower === cleanQ) score += 100;
    else if (nameLower.startsWith(cleanQ)) score += 60;
    else if (nameLower.includes(cleanQ)) score += 40;

    // SKU match (+50)
    if (skuLower === cleanQ) score += 50;

    // Wood species match (+30)
    if (p.woodSpecies?.some((w) => w.toLowerCase().includes(cleanQ))) {
      score += 30;
    }

    // Category match (+25)
    if (catLower.includes(cleanQ)) score += 25;

    // Description match (+10)
    if (descLower.includes(cleanQ)) score += 10;

    if (score > 0) {
      // Normalize to public-safe ProductSearchResult (NO internal notes or supplier cost!)
      scoredProducts.push({
        score,
        item: {
          kind: 'product' as const,
          id: p.id,
          title: p.name,
          slug: p.slug,
          summary: p.shortDescription,
          imageUrl: p.primaryImage?.url || null,
          categoryName: p.categoryName,
          categorySlug: p.categorySlug,
          woodSpecies: p.woodSpecies,
          priceMode: p.priceMode,
          salePricePaise: p.salePricePaise,
          startingPricePaise: p.startingPricePaise,
          currency: p.currency,
          isCustomizable: p.isCustomizable,
          availabilityLabel: p.availabilityLabel,
        },
      });
    }
  });

  // 2. Search Services
  const scoredServices: { item: any; score: number }[] = [];
  searchableServicesDatabase.forEach((s) => {
    let score = 0;
    const titleLower = s.title.toLowerCase();
    const summaryLower = s.summary.toLowerCase();
    const catLower = s.categoryName.toLowerCase();

    if (titleLower === cleanQ) score += 100;
    else if (titleLower.startsWith(cleanQ)) score += 60;
    else if (titleLower.includes(cleanQ)) score += 40;

    if (catLower.includes(cleanQ)) score += 25;
    if (summaryLower.includes(cleanQ)) score += 15;

    if (score > 0) {
      scoredServices.push({
        score,
        item: {
          kind: 'service' as const,
          id: s.id,
          title: s.title,
          slug: s.slug,
          summary: s.summary,
          route: s.route,
          iconName: s.iconName,
          categoryName: s.categoryName,
        },
      });
    }
  });

  // Counts for tabs
  const totalProductsCount = scoredProducts.length;
  const totalServicesCount = scoredServices.length;
  const totalAllCount = totalProductsCount + totalServicesCount;

  // Filter by requested tab
  let candidateList: { item: any; score: number }[] = [];
  if (searchType === 'products') {
    candidateList = scoredProducts;
  } else if (searchType === 'services') {
    candidateList = scoredServices;
  } else {
    candidateList = [...scoredProducts, ...scoredServices];
  }

  // Sort by relevance score descending
  candidateList.sort((a, b) => b.score - a.score);

  const total = candidateList.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const items = candidateList.slice(startIndex, startIndex + limit).map((c) => c.item);

  // Extract matched category chips based on results
  const matchedCategorySlugs = new Set<string>();
  scoredProducts.forEach((p) => matchedCategorySlugs.add(p.item.categorySlug));
  const matchedCategories = verifiedCategories
    .filter((c) => matchedCategorySlugs.has(c.slug))
    .map((c) => ({ slug: c.slug, name: c.name }));

  // Generate related suggestions
  const catalogKeywords = [
    'Teak king bed',
    'Pooja mandir',
    'Solid dining table',
    'Modular wardrobe',
    'Teak entrance door',
    'Modular kitchen',
    'Carpentry repairs',
    'Wood polish',
  ];
  const suggestions = catalogKeywords
    .filter((kw) => kw.toLowerCase() !== cleanQ)
    .slice(0, 4);

  return {
    query: rawQ.slice(0, 100),
    type: searchType,
    items,
    page,
    limit,
    total,
    totalPages,
    counts: {
      all: totalAllCount,
      products: totalProductsCount,
      services: totalServicesCount,
    },
    matchedCategories,
    suggestions,
  };
}

export const standardOrderingSteps: OrderingStep[] = [
  {
    step: 1,
    title: 'Requirement Consultation & Measurement',
    description:
      'Review standard specifications or submit custom room dimensions. We verify vastu orientation, door clearance, and timber preferences.',
  },
  {
    step: 2,
    title: '3D CAD Blueprint & Timber Inspection',
    description:
      'We generate exact joinery drawings and invite you to our Vuyyuru workshop to inspect seasoned timber grains before cutting.',
  },
  {
    step: 3,
    title: 'Workshop Joinery & 50% Advance',
    description:
      'Artisans execute traditional mortise-and-tenon joints, multi-coat sanding, and melamine/PU finishing with milestone photographic updates.',
  },
  {
    step: 4,
    title: 'White-Glove Delivery & Installation',
    description:
      'Our dedicated carpenter team delivers and installs the furniture in your home across Krishna/NTR districts before final sign-off.',
  },
];

/**
 * Fetch a single public product by slug.
 * Strictly excludes draft and private records.
 * Strips all internal costs, margins, and private notes.
 */
export function getPublicProductBySlug(slug: string): PublicProduct | null {
  if (!slug || typeof slug !== 'string') return null;

  const rawSlug = slug.trim().toLowerCase();
  const found = masterProductDatabase.find(
    (p) => p.slug.toLowerCase() === rawSlug && p.status === 'active' && p.visibility === 'public'
  );

  if (!found) return null;

  // Security: Clean internal properties
  const { internalNotes, supplierCostPaise, grossMarginPercentage, ...clean } = found;

  // Add ordering steps if not already defined
  const orderingSteps = clean.orderingSteps || standardOrderingSteps;

  // Find related products in the same category or general active catalogue
  const related = masterProductDatabase
    .filter(
      (p) =>
        p.id !== found.id &&
        p.status === 'active' &&
        p.visibility === 'public' &&
        (p.categorySlug === found.categorySlug || p.categoryId === found.categoryId)
    )
    .slice(0, 3)
    .map((p) => {
      const { internalNotes, supplierCostPaise, grossMarginPercentage, ...cleanRelated } = p;
      return cleanRelated as PublicProduct;
    });

  return {
    ...clean,
    orderingSteps,
    relatedProducts: related,
  } as PublicProduct;
}

/**
 * Submit a product enquiry.
 * Validates product eligibility, Indian mobile phone format, quantity bounds,
 * and custom message length.
 */
export function submitProductEnquiry(payload: ProductEnquiryPayload): {
  success: boolean;
  data?: ProductEnquiryResponse;
  error?: string;
} {
  // 1. Validate Product
  const product = masterProductDatabase.find(
    (p) =>
      (p.id === payload.productId || p.slug === payload.productSlug) &&
      p.status === 'active' &&
      p.visibility === 'public'
  );

  if (!product) {
    return {
      success: false,
      error: 'The requested product is invalid or no longer available for enquiry.',
    };
  }

  // 2. Validate Customer Name
  const name = (payload.customerName || '').trim();
  if (name.length < 2 || name.length > 100) {
    return {
      success: false,
      error: 'Please enter a valid customer name (between 2 and 100 characters).',
    };
  }

  // 3. Validate Phone Number (10 digit Indian number)
  const phoneClean = (payload.customerPhone || '').replace(/\D/g, '');
  if (phoneClean.length < 10 || phoneClean.length > 12) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit mobile phone number for enquiry consultation.',
    };
  }

  // 4. Validate Quantity
  const qty = Number(payload.quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 10) {
    return {
      success: false,
      error: 'Quantity must be a positive integer between 1 and 10.',
    };
  }

  // 5. Validate Message Length
  const msg = (payload.message || '').trim();
  if (msg.length > 500) {
    return {
      success: false,
      error: 'Enquiry message must not exceed 500 characters.',
    };
  }

  // 6. Generate Unique Confirmation
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const enquiryId = `ENQ-2026-${randomSuffix}`;

  return {
    success: true,
    data: {
      enquiryId,
      status: 'received',
      message:
        'Your custom furniture enquiry has been received. Our master artisan from Vuyyuru workshop will review your measurements and contact you within 24 hours.',
      receivedAt: new Date().toISOString(),
      summary: {
        productTitle: product.name,
        estimatedLeadTime: `${product.leadTimeWeeks || 3} weeks made-to-order`,
        consultationContact: '+91 8639731477',
      },
    },
  };
}

/**
 * Screen 05: Submit Custom Furniture Request (Guided Requirements Form)
 * Enforces per-step validation, phone normalization, required contact consent,
 * optional marketing consent, and server-generated unique reference.
 */
export function submitCustomFurnitureEnquiry(payload: CustomFurnitureEnquiryPayload): {
  success: boolean;
  data?: CustomFurnitureEnquiryResponse;
  error?: string;
} {
  // 1. Step 1 Validation: Requirements
  if (!payload.requirements) {
    return { success: false, error: 'Project requirements are required.' };
  }

  const { furnitureType, customFurnitureType, description, quantity } = payload.requirements;
  if (!furnitureType) {
    return { success: false, error: 'Please select a furniture type.' };
  }
  if (furnitureType === 'other' && (!customFurnitureType || !customFurnitureType.trim())) {
    return { success: false, error: 'Please specify the custom furniture item.' };
  }

  const cleanDesc = (description || '').trim();
  if (cleanDesc.length < 10) {
    return {
      success: false,
      error: 'Please describe your custom furniture project (minimum 10 characters).',
    };
  }
  if (cleanDesc.length > 1500) {
    return { success: false, error: 'Project description must not exceed 1,500 characters.' };
  }

  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
    return { success: false, error: 'Number of items must be a positive integer between 1 and 20.' };
  }

  // 2. Step 2 Validation: Dimensions
  const dims = payload.requirements.dimensions;
  if (dims) {
    if (dims.widthMm !== undefined && dims.widthMm <= 0) {
      return { success: false, error: 'Width must be a positive number in millimetres.' };
    }
    if (dims.heightMm !== undefined && dims.heightMm <= 0) {
      return { success: false, error: 'Height must be a positive number in millimetres.' };
    }
    if (dims.depthMm !== undefined && dims.depthMm <= 0) {
      return { success: false, error: 'Depth must be a positive number in millimetres.' };
    }
  }

  // 3. Step 3 Validation: Site details
  if (!payload.site || !payload.site.area || !payload.site.area.trim()) {
    return { success: false, error: 'Please enter your locality / area in Andhra Pradesh.' };
  }
  if (!payload.site.visitRequested) {
    return { success: false, error: 'Please indicate whether an on-site survey is requested.' };
  }

  if (
    (payload.site.visitRequested === 'yes' || payload.site.visitRequested === 'advise_me') &&
    payload.site.preferredDate
  ) {
    const selectedDate = new Date(payload.site.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return { success: false, error: 'Preferred site visit date must be in the future.' };
    }
  }

  // 4. Step 4 Validation: Customer details & consent
  if (!payload.customer) {
    return { success: false, error: 'Customer contact details are required.' };
  }

  const cleanName = (payload.customer.name || '').trim();
  if (cleanName.length < 2 || cleanName.length > 100) {
    return { success: false, error: 'Please enter your full name (between 2 and 100 characters).' };
  }

  const rawPhone = (payload.customer.phone || '').replace(/\D/g, '');
  if (rawPhone.length < 10 || rawPhone.length > 12) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number.' };
  }

  // 5. Consent Enforcement
  if (!payload.consent || !payload.consent.contactForThisEnquiry) {
    return {
      success: false,
      error: 'You must consent to Vuyyuru Carpentry contacting you regarding this quotation request.',
    };
  }

  // 6. Generate Server-Side Reference
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const currentYear = 2026;
  const reference = `VC-REQ-${currentYear}-${randomSuffix}`;
  const enquiryId = `enq_${Math.random().toString(36).substring(2, 10)}`;

  const displayType =
    furnitureType === 'other' ? customFurnitureType || 'Custom Joinery' : furnitureType;

  return {
    success: true,
    data: {
      enquiryId,
      reference,
      status: 'received',
      message:
        'Your custom furniture request has been received. Our master artisan will review your requirements, timber choices, and contact you to arrange specifications.',
      receivedAt: new Date().toISOString(),
      summary: {
        furnitureType: displayType,
        quantity: qty,
        area: payload.site.area.trim(),
        siteVisitRequested: payload.site.visitRequested,
        preferredContactMethod: payload.customer.preferredContactMethod || 'whatsapp',
      },
    },
  };
}

// -------------------------------------------------------------
// Screen 06: Services Domain Database & Helpers
// -------------------------------------------------------------
export const masterServicesDatabase: PublicService[] = [
  {
    id: 'srv-repairs',
    name: 'Carpentry Repairs & Hardware Maintenance',
    slug: 'repairs',
    summary:
      'Door sagging correction, squeaking hinges, loose joinery clamping, Godrej/Ebco lock replacement, and termite damage inspection.',
    description:
      'Comprehensive on-site repair and restoration service across Vuyyuru and nearby towns. Our skilled carpenters diagnose sagging shutters, replace worn-out drawer runners, plane rubbing door edges, and reinforce loose joint dowels with high-tensile fasteners.',
    category: 'repair',
    categoryName: 'Repairs & Maintenance',
    pricingMode: 'indicative',
    indicativeMinPaise: 45000, // ₹450
    indicativeMaxPaise: 250000, // ₹2,500
    scopeNotes: [
      'Comprehensive on-site inspection and diagnosis',
      'Hinge realignment, lubrication, and door edge planing',
      'Structural dowel joint clamping and wood adhesive re-bonding',
      'Lock mortising and alignment with strike plates',
      'Replacement hardware (Ebco/Godrej/Blum) and timber infills billed at verified actuals',
    ],
    exclusions: [
      'Civil masonry cracking, wall replastering, or floor tiling alterations',
      'Aluminum / UPVC sliding window frame fabrication',
      'Motorized gate electrical sensor servicing',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=800&q=80',
    iconName: 'Hammer',
    status: 'active',
    displayOrder: 1,
    leadTimeEstimate: 'Same-day to 48-hour dispatch based on artisan availability',
    typicalDuration: '1 to 4 hours on site',
    serviceAreaNotice: 'Immediate dispatch in Vuyyuru town; Vijayawada and Guntur subject to daily routing.',
  },
  {
    id: 'srv-custom-furniture',
    name: 'Bespoke Solid Teakwood Furniture Fabrication',
    slug: 'custom-furniture',
    summary:
      'Handcrafted king cots, solid dining tables, diwans, study desks, and carved pooja mandirs built with seasoned Burma and CP teakwood.',
    description:
      'Heirloom-grade made-to-measure furniture crafted by master artisans at our Vuyyuru workshop. Every commission begins with 3D CAD joinery planning, timber grain inspection by the customer, traditional mortise-and-tenon construction, and hand-rubbed melamine or PU finishing.',
    category: 'custom_furniture',
    categoryName: 'Custom Furniture',
    pricingMode: 'inspection_required',
    scopeNotes: [
      'Detailed requirement analysis and 3D CAD blueprint sign-off',
      'Customer grain inspection of seasoned Burma/CP teakwood before cutting',
      'Traditional mortise-and-tenon joinery with zero sapwood compromise',
      'Multi-coat hand-sanded Italian PU or melamine protective coating',
      'White-glove delivery, room placement, and leveling on site',
    ],
    exclusions: [
      'Soft furnishings, external mattress procurement, and cushions',
      'Third-party electrical lighting not specified in written scope',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',
    iconName: 'Sofa',
    status: 'active',
    displayOrder: 2,
    leadTimeEstimate: '3 to 5 weeks made-to-order',
    typicalDuration: 'Fabricated in workshop with 1-day home installation',
    serviceAreaNotice: 'Delivered and assembled across Krishna, NTR, and Guntur districts.',
  },
  {
    id: 'srv-doors-frames',
    name: 'Solid Teak Main Entrance Doors & Architraves',
    slug: 'doors-and-frames',
    summary:
      'Heavy-gauge solid teak main doors with temple floral carvings, architraves, door frames (chowkhats), and natural veneer interior doors.',
    description:
      'Traditional and contemporary architectural door fabrication. Built from solid 40mm–45mm seasoned teakwood frames capable of withstanding coastal Andhra humidity without warping or joint shrinkage.',
    category: 'doors_wardrobes',
    categoryName: 'Doors & Architectural Frames',
    pricingMode: 'inspection_required',
    scopeNotes: [
      'On-site laser measurement of masonry openings and wall plumbness',
      'Solid teak frame (chowkhat) anchoring with anti-corrosion wall fasteners',
      'Hand-carved floral, geometric, or traditional temple motif detailing',
      'Installation of heavy brass hinges, brass tower bolts, and mortise handles',
      'Polyurethane spray sealer for maximum weather protection',
    ],
    exclusions: [
      'Civil masonry demolition or structural beam alteration',
      'External steel security collapsible grill fabrication',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    iconName: 'DoorClosed',
    status: 'active',
    displayOrder: 3,
    leadTimeEstimate: '2 to 4 weeks depending on carving intricacy',
    typicalDuration: '1 to 2 days on-site hanging and fitting',
    serviceAreaNotice: 'On-site survey and installation across coastal Andhra Pradesh.',
  },
  {
    id: 'srv-modular-wardrobes',
    name: 'Fitted Modular Wardrobes & Loft Storage',
    slug: 'modular-wardrobes',
    summary:
      'Floor-to-ceiling wardrobes, sliding shutters, customized internal drawers, and walk-in dressing units in BWP ply or HDHMR.',
    description:
      'Maximized storage solutions tailored to bedroom architecture. Engineered with Action TESA HDHMR or Century BWP 710 marine plywood carcasses, soft-close tandem runners, integrated dressers, and high-pressure 1mm laminate or acrylic finishes.',
    category: 'doors_wardrobes',
    categoryName: 'Wardrobes & Closets',
    pricingMode: 'inspection_required',
    scopeNotes: [
      'Laser site survey to detect wall undulations and floor gradients',
      'Customized internal division (saree hangers, double hanging, jewelry trays)',
      'Soft-close telescopic drawer channels and 110-degree clip-on hinges',
      'Factory edge-banded shutters with 2mm PVC hot-melt tape',
      'Full floor-to-ceiling loft boxing with seamless alignment',
    ],
    exclusions: [
      'Room electrical wiring overhaul or ceiling lighting modifications',
      'Civil skirting tile removal',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    iconName: 'Store',
    status: 'active',
    displayOrder: 4,
    leadTimeEstimate: '2 to 3 weeks',
    typicalDuration: '2 to 3 days on-site assembly',
    serviceAreaNotice: 'Full measurement and installation service in Vuyyuru, Vijayawada, and Guntur.',
  },
  {
    id: 'srv-modular-kitchens',
    name: 'BWP Marine Ply Modular Kitchen Joinery',
    slug: 'modular-kitchens',
    summary:
      '100% boiling-waterproof BWP 710 marine plywood carcasses, soft-close Blum/Hettich tandem baskets, and anti-fingerprint acrylic shutters.',
    description:
      'High-durability modular kitchen joinery built to endure coastal Andhra cooking conditions. We utilize Century Club Prime BWP 710 marine plywood, anti-corrosion SS304 fittings, and precision layout planning around existing granite slabs and plumbing lines.',
    category: 'interiors',
    categoryName: 'Modular Kitchens & Interiors',
    pricingMode: 'inspection_required',
    scopeNotes: [
      'Laser survey of countertop level, gas inlet, and sink plumbing positions',
      '100% BWP 710 marine plywood carcass with waterproof laminate lining',
      'Tandem soft-close pull-out baskets (thali, cup-saucer, cutlery, grain trolley)',
      'Pantry tall units with multi-level heavy-duty chrome baskets',
      'Overhead cabinet boxing with gas-spring hydraulic lift-up shutters',
    ],
    exclusions: [
      'Granite or quartz stone countertop slab casting',
      'Civil plumbing pipe relocation and kitchen chimney appliance purchase',
      'Gas copper pipeline laying',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
    iconName: 'Utensils',
    status: 'active',
    displayOrder: 5,
    leadTimeEstimate: '3 to 4 weeks',
    typicalDuration: '3 to 4 days on-site erection and sealing',
    serviceAreaNotice: 'Available across Vuyyuru, Vijayawada, Guntur, and Tenali.',
  },
  {
    id: 'srv-finishing-polishing',
    name: 'Wood Polishing, Melamine & Italian PU Finishing',
    slug: 'wood-polishing-finishing',
    summary:
      'Hand-rubbed spirit polish, Italian Polyurethane (PU) spray coating in high-gloss and matte, melamine sealing, and vintage restoration.',
    description:
      'Artisanal wood finishing that seals, protects, and magnifies the natural grain character of teakwood. We offer multi-coat clear sealers, stain tints (walnut, honey, antique), and ultra-durable Italian PU coatings resistant to water rings and daily wear.',
    category: 'finishing',
    categoryName: 'Finishing & Polishing',
    pricingMode: 'indicative',
    indicativeMinPaise: 3500, // ₹35 / sq.ft
    indicativeMaxPaise: 12000, // ₹120 / sq.ft
    scopeNotes: [
      'Multi-grit pneumatic machine sanding (80 to 400 grit) to achieve glass-smooth base',
      'Wood pore filling with color-matched natural timber putty',
      'Hand-rubbed sealer coats to prevent moisture absorption',
      'Dust-free spray application of Asian Paints / Sirca Italian PU or Melamine',
      'Antique furniture surface decontamination and natural luster revival',
    ],
    exclusions: [
      'Civil building wall painting and false ceiling emulsion painting',
      'Outdoor exterior wood exposed directly to monsoon rain without overhead eaves',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
    iconName: 'Sparkles',
    status: 'active',
    displayOrder: 6,
    leadTimeEstimate: '1 to 2 weeks depending on square footage and coat curing time',
    typicalDuration: '2 to 5 days on site or in workshop spray booth',
    serviceAreaNotice: 'Workshop spray booth and on-site service across Krishna district.',
  },
  {
    id: 'srv-commercial-fixtures',
    name: 'Commercial Interiors & Retail Shop Fixtures',
    slug: 'commercial-fixtures',
    summary:
      'Heavy-duty billing counters, retail display showcase shelving, reception desks, and acoustic partition screens for offices and shops.',
    description:
      'Fast-turnaround commercial woodwork designed for high daily footfall. We construct modular billing desks, glass showcase display vitrines, fluted timber acoustic partitions, and pharmacy/boutique wall display racks with concealed cable ducts.',
    category: 'commercial',
    categoryName: 'Commercial & Retail Fixtures',
    pricingMode: 'inspection_required',
    scopeNotes: [
      'Commercial space measurement and workflow circulation planning',
      'Heavy-duty 1.2mm anti-wear commercial grade laminates',
      'Concealed POS cable ducts, cash drawers with central locking',
      'Toughened glass showcase display shelving with concealed LED profiles',
      'Staggered night installation options to minimize business downtime',
    ],
    exclusions: [
      'Exterior storefront LED signage and flex glow-sign boards',
      'HVAC ducting and central air conditioning civil modifications',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    iconName: 'Store',
    status: 'active',
    displayOrder: 7,
    leadTimeEstimate: '2 to 3 weeks with milestone handover',
    typicalDuration: '2 to 4 days commercial installation',
    serviceAreaNotice: 'Serving commercial establishments in Vuyyuru, Vijayawada, and Guntur.',
  },
  // Internal Draft Service (Strictly filtered out from public endpoints to verify status gating)
  {
    id: 'srv-marine-draft',
    name: 'Experimental Marine Hull Woodwork (Internal Draft)',
    slug: 'marine-hull-draft',
    summary: 'Internal testing service for boat hull joinery. Not available to the public.',
    description: 'Internal experimental service. Must not be returned in public queries.',
    category: 'commercial',
    categoryName: 'Commercial',
    pricingMode: 'inspection_required',
    scopeNotes: ['Internal draft notes only'],
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957',
    iconName: 'Hammer',
    status: 'draft',
    displayOrder: 99,
  },
];

export const verifiedServiceFaqs: ServiceFaq[] = [
  {
    id: 'faq-01',
    question: 'How do you calculate pricing for custom carpentry work?',
    answer:
      'All bespoke furniture, modular kitchens, and custom wardrobes require an in-person or laser site inspection. We prepare a transparent, itemized written quotation detailing seasoned timber cubic feet, hardware brands (Blum, Hettich, Ebco), joinery labor, and finishing coats. We never guess final prices from rough dimensions alone.',
    category: 'pricing',
    displayOrder: 1,
  },
  {
    id: 'faq-02',
    question: 'Do you charge for site visits in Vuyyuru, Vijayawada, and Guntur?',
    answer:
      'Initial consultation visits in Vuyyuru town are complimentary. For Vijayawada, Guntur, and outlying rural areas, a nominal travel and laser survey fee may apply, which is 100% credited toward your project balance upon quotation approval.',
    category: 'site_visit',
    displayOrder: 2,
  },
  {
    id: 'faq-03',
    question: 'Can I inspect the timber grains before carpentry cutting begins?',
    answer:
      'Yes, absolutely. We encourage customers to visit our Vuyyuru workshop after seasoned timber delivery to inspect the grain figure, natural color, and density of Burma Teak, CP Teak, or BWP 710 ply sheets before our carpenters make the first cut.',
    category: 'materials',
    displayOrder: 3,
  },
  {
    id: 'faq-04',
    question: 'How do milestone payments work for large carpentry contracts?',
    answer:
      'In strict accordance with our verified business documentation, we follow a traceable 3-stage milestone structure: 50% advance upon contract signing to procure seasoned timber; 40% after carcass fabrication and workshop inspection; and the final 10% after white-glove delivery, on-site installation, and leveling sign-off.',
    category: 'payments',
    displayOrder: 4,
  },
  {
    id: 'faq-05',
    question: 'Can you provide emergency same-day repair service?',
    answer:
      'Carpentry repairs depend on daily workshop capacity and carpenter routes. While we prioritize urgent lock malfunctions, door alignment issues, and broken hinges, we never promise unconditional same-day service without confirming active craftsman availability.',
    category: 'repairs',
    displayOrder: 5,
  },
  {
    id: 'faq-06',
    question: 'What happens if on-site room measurements or requirements change during work?',
    answer:
      'Any modification in dimensions, additional internal drawers, or hardware upgrades is documented in a written scope variation with traceable cost adjustments. Both the customer and carpenter sign off on scope changes before joinery alterations begin.',
    category: 'scope',
    displayOrder: 6,
  },
];

/**
 * Fetch active public services.
 * Strictly filters out draft and archived records.
 */
export function queryPublicServices(options?: { category?: string }): PublicService[] {
  let list = masterServicesDatabase.filter((s) => s.status === 'active');
  if (options?.category && options.category !== 'all') {
    list = list.filter((s) => s.category === options.category);
  }
  return list.sort((a, b) => a.displayOrder - b.displayOrder);
}

/**
 * Fetch a single public service by slug.
 * Returns null if not found or inactive.
 */
export function getPublicServiceBySlug(slug: string): PublicService | null {
  if (!slug || typeof slug !== 'string') return null;
  const cleanSlug = slug.trim().toLowerCase();
  const found = masterServicesDatabase.find(
    (s) => s.slug.toLowerCase() === cleanSlug && s.status === 'active'
  );
  return found || null;
}

/**
 * Fetch approved public service FAQs.
 */
export function getPublicServiceFaqs(): ServiceFaq[] {
  return [...verifiedServiceFaqs].sort((a, b) => a.displayOrder - b.displayOrder);
}

// -------------------------------------------------------------
// Screen 08: Approved Public About Content
// Strict Rule: No unsupported claims, fake awards, unconfirmed staff biographies.
// -------------------------------------------------------------
export const verifiedAboutContent: PublicAboutContent = {
  businessName: 'Vuyyuru Carpentry',
  tagline: 'Carpentry Built Around Your Requirements',
  headline: 'Local Carpentry Built Around Your Requirements',
  subheading:
    'A dedicated joinery workshop serving Vuyyuru town and suitable nearby Andhra areas with honest craftsmanship, written quotations, and realistic scheduling.',
  storyParagraphs: [
    'Vuyyuru Carpentry is a community-grounded joinery workshop based in Vuyyuru town, Krishna District, Andhra Pradesh. We specialize in made-to-measure teakwood furniture, residential entrance doors, fitted wardrobes, modular kitchen joinery, and careful structural repairs.',
    'Our operating philosophy is built on three straightforward commitments: clear scope, traceable costs, and honest craftsmanship. Instead of rushing verbal estimates or supplying generic flat-pack panels, we review requirements carefully, verify site measurements, advise on timber species suited to coastal Andhra humidity, and issue written quotations before any work begins.',
    'As an active workshop team of experienced artisans, we prioritize direct service in Vuyyuru mandal, with nearby projects across Vijayawada, Guntur, and Tenali scheduled according to travel feasibility and workshop capacity.',
  ],
  serviceAreaStatement:
    'Headquartered with our active joinery workshop in Vuyyuru town. We serve Vuyyuru mandal first, with nearby projects across Vijayawada, Guntur, Mangalagiri, and Tenali scheduled based on travel feasibility and workshop capacity.',
  values: [
    {
      id: 'val-01',
      title: 'Clear Written Scope',
      description:
        'Every project begins with defined requirements, site measurements where needed, and a transparent written quotation so you know exactly what is included.',
      iconName: 'FileText',
    },
    {
      id: 'val-02',
      title: 'Realistic Commitments',
      description:
        'We commit only to timelines we can reliably honor based on genuine workshop capacity. We do not make false same-day promises or overcommit our artisans.',
      iconName: 'Clock',
    },
    {
      id: 'val-03',
      title: 'Traceable Timber & Materials',
      description:
        'We craft with seasoned hardwoods (Burma and Ghana Teak) and certified boiling water-proof (BWP IS:710) marine plywood, selected to withstand local climatic conditions.',
      iconName: 'TreePine',
    },
    {
      id: 'val-04',
      title: 'Clean Site Respect',
      description:
        'Whether assembling custom wardrobes on site or installing entrance door architraves, our carpenters work neatly, protect adjacent flooring, and leave work areas tidy.',
      iconName: 'Sparkles',
    },
  ],
  processSteps: [
    {
      step: 1,
      title: 'Share Requirements',
      description:
        'Describe what you need online, via WhatsApp, or over the phone. Share photos, room dimensions, or design ideas.',
    },
    {
      step: 2,
      title: 'Scope Review',
      description:
        'We evaluate feasibility, advise on suitable timber and hardware, and determine whether an on-site visit is needed.',
    },
    {
      step: 3,
      title: 'Laser Site Survey',
      description:
        'For kitchens, wardrobes, doors, and built-ins, an artisan visits your site to verify exact dimensions and wall plumb.',
    },
    {
      step: 4,
      title: 'Written Quotation',
      description:
        'You receive an itemized quote detailing timber grades, hardware, milestones, and realistic timelines prior to approval.',
    },
    {
      step: 5,
      title: 'Workshop Joinery & Fit',
      description:
        'Joinery is precision-crafted in our Vuyyuru workshop, followed by careful on-site delivery and professional fitting.',
    },
  ],
  teamStatement:
    'Our workshop operates with a dedicated team of master joiners and apprentices who take personal pride in every mortise, tenon, and hand-rubbed finish.',
  workshopPhoto: {
    url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
    alt: 'Master artisan hand-finishing seasoned teakwood joinery in Vuyyuru workshop',
    caption: 'Active workshop fabrication and precision joinery in Vuyyuru, Andhra Pradesh',
    approvedForPublication: true,
  },
  contactSummary: {
    phone: '+91 94402 81734',
    whatsapp: '+91 94402 81734',
    workshopAddress:
      'Main Road, Near Sri Sai Baba Temple, Vuyyuru, Krishna District, Andhra Pradesh - 521165',
    consultationHours:
      'Monday – Saturday: 8:30 AM – 6:30 PM (Site visits by prior appointment)',
  },
  servicesSummary: {
    title: 'Comprehensive Woodworking Services',
    description:
      'Explore our full range of carpentry services from small residential repairs to whole-house custom woodwork.',
    linkHref: '/services',
    linkText: 'Explore All Services',
  },
};

/**
 * Fetch approved public about content.
 * Privacy & Truthfulness Rule: Hide unapproved workshop photos or unconfirmed records.
 */
export function getPublicAboutContent(): PublicAboutContent {
  const content = { ...verifiedAboutContent };

  if (content.workshopPhoto && !content.workshopPhoto.approvedForPublication) {
    delete content.workshopPhoto;
  }

  return content;
}

// -------------------------------------------------------------
// Screen 09: General Enquiry & Site-Visit Request In-Memory Store & Validator
// -------------------------------------------------------------
export const masterGeneralEnquiriesList: Array<
  GeneralEnquiryPayload & {
    id: string;
    reference: string;
    status: 'received';
    createdAt: string;
  }
> = [];

export function submitGeneralEnquiry(payload: GeneralEnquiryPayload): {
  success: boolean;
  data?: GeneralEnquiryResponse;
  error?: string;
} {
  // 1. Customer Name Validation
  const name = payload.customer?.name?.trim();
  if (!name || name.length < 2) {
    return { success: false, error: 'Please enter your full name (minimum 2 characters).' };
  }
  if (name.length > 100) {
    return { success: false, error: 'Name must not exceed 100 characters.' };
  }

  // 2. Phone Validation & Normalization
  const rawPhone = payload.customer?.phone?.trim() || '';
  const digitsOnly = rawPhone.replace(/\D/g, '');
  const normalizedPhone = digitsOnly.length === 12 && digitsOnly.startsWith('91')
    ? digitsOnly.slice(2)
    : digitsOnly.length === 11 && digitsOnly.startsWith('0')
    ? digitsOnly.slice(1)
    : digitsOnly;

  if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).',
    };
  }

  // 3. Email Validation (if provided)
  if (payload.customer?.email?.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.customer.email.trim())) {
      return { success: false, error: 'Please enter a valid email address or leave it blank.' };
    }
  }

  // 4. Service Selection Validation (must match active service by id or slug)
  const serviceKey = payload.serviceId?.trim().toLowerCase();
  const matchedService = masterServicesDatabase.find(
    (s) =>
      s.status === 'active' &&
      (s.id.toLowerCase() === serviceKey || s.slug.toLowerCase() === serviceKey)
  );

  if (!matchedService) {
    return {
      success: false,
      error: 'Please select a valid, active carpentry service from the list.',
    };
  }

  // 5. Description Validation
  const description = payload.description?.trim();
  if (!description || description.length < 10) {
    return {
      success: false,
      error: 'Please provide at least 10 characters describing your carpentry or repair requirements.',
    };
  }
  if (description.length > 1000) {
    return {
      success: false,
      error: 'Description cannot exceed 1000 characters.',
    };
  }

  // 6. Area / Locality Validation
  const area = payload.location?.area?.trim();
  if (!area || area.length < 2) {
    return {
      success: false,
      error: 'Please specify your town, mandal, or locality (e.g. Vuyyuru, Benz Circle Vijayawada).',
    };
  }

  // 7. Site Visit Specific Validations
  if (payload.siteVisit?.requested === 'yes') {
    if (payload.siteVisit.preferredDate) {
      const selected = new Date(payload.siteVisit.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (isNaN(selected.getTime()) || selected < today) {
        return {
          success: false,
          error: 'Preferred site visit date must be today or a future date.',
        };
      }
    }
  }

  // 8. Consent Validation
  if (!payload.consent?.contactForThisEnquiry) {
    return {
      success: false,
      error: 'You must provide consent for Vuyyuru Carpentry to contact you regarding this request.',
    };
  }

  // Generate authoritative reference ID
  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const reference = `VC-ENQ-2026-${randomSuffix}`;
  const enquiryId = `enq_${timestamp}_${randomSuffix}`;

  // Store in memory
  masterGeneralEnquiriesList.push({
    ...payload,
    customer: {
      ...payload.customer,
      phone: normalizedPhone,
    },
    id: enquiryId,
    reference,
    status: 'received',
    createdAt: new Date().toISOString(),
  });

  return {
    success: true,
    data: {
      enquiryId,
      reference,
      status: 'received',
      receivedAt: new Date().toISOString(),
      message:
        'Your enquiry has been received by our workshop. Our artisan team will review your scope and location and reach out via your preferred contact channel.',
      summary: {
        serviceName: matchedService.name,
        area,
        urgency: payload.urgency || 'flexible',
        siteVisitRequested: payload.siteVisit?.requested || 'advise_me',
        preferredContactMethod: payload.customer?.preferredContactMethod || 'phone',
        preferredDate: payload.siteVisit?.preferredDate || null,
        preferredTimeWindow: payload.siteVisit?.preferredTimeWindow || null,
        consultationNotice:
          'Submitting an enquiry or selecting a date does not constitute an automatically confirmed booking. The workshop will confirm time and travel feasibility directly.',
      },
    },
  };
}

// =============================================================
// Screen 10: Shopping Cart Store & Authoritative Engine
// =============================================================

export interface StoredCartItem {
  id: string;
  productId: string;
  quantity: number;
  selectedWoodSpecies?: string;
  selectedFinish?: string;
  snapshotPricePaise?: number;
  addedAt: string;
}

export interface StoredCart {
  id: string;
  guestSessionId: string;
  items: StoredCartItem[];
  appliedCoupon?: string | null;
  updatedAt: string;
}

// In-memory cart database keyed by guestSessionId
export const masterCartDatabase = new Map<string, StoredCart>();

// Initialize a default demo cart with 1 fixed-price item for easy demonstration
export function initializeDemoCart(sessionId: string = 'demo_guest_session'): StoredCart {
  const existing = masterCartDatabase.get(sessionId);
  if (existing) return existing;

  const demoCart: StoredCart = {
    id: `cart_${Date.now()}`,
    guestSessionId: sessionId,
    items: [
      {
        id: 'ci_demo_fixed_bed_01',
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
  };

  masterCartDatabase.set(sessionId, demoCart);
  return demoCart;
}

// Ensure demo cart is available
initializeDemoCart('demo_guest_session');

/**
 * Recalculate & revalidate a cart against the authoritative product database
 */
export function revalidateCart(cart: StoredCart): CartSummary {
  const items: CartItem[] = [];
  let subtotalPaise = 0;
  let hasIneligibleItems = false;
  let staleWarnings: string[] = [];

  for (const item of cart.items) {
    const product = masterProductDatabase.find(
      (p) => p.id === item.productId || p.slug === item.productId
    );

    if (!product || product.status !== 'active') {
      hasIneligibleItems = true;
      items.push({
        id: item.id,
        productId: item.productId,
        slug: product?.slug || item.productId,
        name: product?.name || 'Unlisted Workshop Item',
        category: (product as any)?.categoryName || (product as any)?.category || 'Custom Furniture',
        image: product?.primaryImage?.url || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=400&q=80',
        pricePaise: item.snapshotPricePaise || 0,
        quantity: item.quantity,
        lineTotalPaise: 0,
        isEligible: false,
        eligibilityReason: 'This product is currently unlisted or inactive. Please remove it to continue checkout.',
        selectedWoodSpecies: item.selectedWoodSpecies,
        selectedFinish: item.selectedFinish,
      });
      continue;
    }

    // Rule: Only products explicitly configured for fixed-price online purchase can be bought online
    if (product.priceMode !== 'fixed') {
      hasIneligibleItems = true;
      items.push({
        id: item.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        category: (product as any)?.categoryName || (product as any)?.category || 'Custom Furniture',
        image: product.primaryImage?.url || '',
        pricePaise: product.salePricePaise || ((product.startingPrice || 0) * 100),
        quantity: item.quantity,
        lineTotalPaise: 0,
        isEligible: false,
        eligibilityReason: 'This item is made-to-measure / bespoke and requires site measurement and a written quotation. It cannot be purchased online directly.',
        selectedWoodSpecies: item.selectedWoodSpecies,
        selectedFinish: item.selectedFinish,
      });
      continue;
    }

    // Authoritative fixed price loaded strictly from server product record
    const serverPricePaise = product.salePricePaise || ((product.startingPrice || 0) * 100);
    let priceChanged = false;

    if (item.snapshotPricePaise && item.snapshotPricePaise !== serverPricePaise) {
      priceChanged = true;
      staleWarnings.push(
        `Price for "${product.name}" was updated from ₹${(item.snapshotPricePaise / 100).toLocaleString('en-IN')} to ₹${(serverPricePaise / 100).toLocaleString('en-IN')} based on current timber rates.`
      );
    }

    const lineTotalPaise = serverPricePaise * item.quantity;
    subtotalPaise += lineTotalPaise;

    items.push({
      id: item.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: (product as any)?.categoryName || (product as any)?.category || 'Custom Furniture',
      image: product.primaryImage?.url || '',
      pricePaise: serverPricePaise,
      originalPricePaise: item.snapshotPricePaise,
      priceChanged,
      quantity: item.quantity,
      lineTotalPaise,
      isEligible: true,
      eligibilityReason: null,
      selectedWoodSpecies: item.selectedWoodSpecies,
      selectedFinish: item.selectedFinish,
      dimensionsSummary: product.dimensionsSummary,
    });
  }

  // Calculate delivery & taxes according to strict configured rules (no invented fees)
  const deliveryChargesPaise = 0; // Complimentary local delivery in Vuyyuru town & mandal
  const deliveryNotice = 'Complimentary workshop pickup or local delivery within Vuyyuru town.';
  const taxPaise = 0; // Prices are inclusive of applicable taxes
  const taxNotice = 'All prices include applicable taxes. Transparent workshop pricing.';

  // Optional real configured discount coupon
  let discountPaise = 0;
  if (cart.appliedCoupon === 'VUYYURU2026') {
    // 5% discount up to ₹2,500 (250,000 paise)
    discountPaise = Math.min(Math.round(subtotalPaise * 0.05), 250000);
  }

  const estimatedTotalPaise = Math.max(0, subtotalPaise + deliveryChargesPaise + taxPaise - discountPaise);
  const totalItemCount = items.reduce((acc, curr) => acc + (curr.isEligible ? curr.quantity : 0), 0);
  const canCheckout = items.length > 0 && !hasIneligibleItems;

  return {
    id: cart.id,
    guestSessionId: cart.guestSessionId,
    items,
    currency: 'INR',
    subtotalPaise,
    deliveryChargesPaise,
    deliveryNotice,
    taxPaise,
    taxNotice,
    discountPaise,
    appliedCouponCode: cart.appliedCoupon || null,
    estimatedTotalPaise,
    hasIneligibleItems,
    stalePriceWarning: staleWarnings.length > 0 ? staleWarnings.join(' ') : null,
    canCheckout,
    totalItemCount,
    updatedAt: cart.updatedAt,
  };
}

/**
 * Get or create a cart for a guest session
 */
export function getCart(sessionId: string): CartSummary {
  let cart = masterCartDatabase.get(sessionId);
  if (!cart) {
    cart = {
      id: `cart_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      guestSessionId: sessionId,
      items: [],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    };
    masterCartDatabase.set(sessionId, cart);
  }

  return revalidateCart(cart);
}

/**
 * Add an eligible fixed-price product to cart
 */
export function addItemToCart(
  sessionId: string,
  payload: AddToCartPayload
): { success: boolean; cart?: CartSummary; error?: string } {
  const { productId, quantity = 1, selectedWoodSpecies, selectedFinish } = payload;

  if (!productId) {
    return { success: false, error: 'Product ID is required.' };
  }

  // Validate quantity
  if (typeof quantity !== 'number' || isNaN(quantity) || !Number.isInteger(quantity) || quantity < 1) {
    return { success: false, error: 'Quantity must be a positive whole number (minimum 1).' };
  }
  if (quantity > 10) {
    return { success: false, error: 'Maximum 10 units allowed per online order. For larger batches, contact our workshop.' };
  }

  // Authoritative product lookup
  const product = masterProductDatabase.find(
    (p) => p.id === productId || p.slug === productId
  );

  if (!product || product.status !== 'active') {
    return { success: false, error: 'This product is not currently available for online orders.' };
  }

  // Enforce rule: Only fixed-price products can be added to purchasable cart
  if (product.priceMode !== 'fixed') {
    return {
      success: false,
      error: 'Custom made-to-measure furniture requires site inspection and a written quotation. Please submit a Custom Furniture Request instead of adding to cart.',
    };
  }

  // Retrieve or create cart
  let cart = masterCartDatabase.get(sessionId);
  if (!cart) {
    cart = {
      id: `cart_${Date.now()}`,
      guestSessionId: sessionId,
      items: [],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    };
    masterCartDatabase.set(sessionId, cart);
  }

  // Check if item already in cart with identical options
  const existingItemIndex = cart.items.findIndex(
    (item) =>
      item.productId === product.id &&
      item.selectedWoodSpecies === (selectedWoodSpecies || undefined) &&
      item.selectedFinish === (selectedFinish || undefined)
  );

  const serverPricePaise = product.salePricePaise || ((product.startingPrice || 0) * 100);

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (newQty > 10) {
      return { success: false, error: 'Maximum 10 units allowed per item in cart.' };
    }
    cart.items[existingItemIndex].quantity = newQty;
    cart.items[existingItemIndex].snapshotPricePaise = serverPricePaise;
  } else {
    cart.items.push({
      id: `ci_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      productId: product.id,
      quantity,
      selectedWoodSpecies: selectedWoodSpecies || (product.woodSpecies && product.woodSpecies[0]),
      selectedFinish: selectedFinish || product.finishType,
      snapshotPricePaise: serverPricePaise,
      addedAt: new Date().toISOString(),
    });
  }

  cart.updatedAt = new Date().toISOString();
  return { success: true, cart: revalidateCart(cart) };
}

/**
 * Update quantity of a cart item
 */
export function updateCartItem(
  sessionId: string,
  itemId: string,
  quantity: number
): { success: boolean; cart?: CartSummary; error?: string } {
  if (typeof quantity !== 'number' || isNaN(quantity) || !Number.isInteger(quantity) || quantity < 1) {
    return {
      success: false,
      error: 'Quantity must be a positive whole number (minimum 1). Use the remove button to delete.',
    };
  }
  if (quantity > 10) {
    return {
      success: false,
      error: 'Maximum 10 units allowed per online order. Contact workshop for volume orders.',
    };
  }

  const cart = masterCartDatabase.get(sessionId);
  if (!cart) {
    return { success: false, error: 'Cart not found.' };
  }

  const itemIndex = cart.items.findIndex((i) => i.id === itemId);
  if (itemIndex === -1) {
    return { success: false, error: 'Item not found in cart.' };
  }

  cart.items[itemIndex].quantity = quantity;
  cart.updatedAt = new Date().toISOString();

  return { success: true, cart: revalidateCart(cart) };
}

/**
 * Remove an item from cart
 */
export function removeCartItem(
  sessionId: string,
  itemId: string
): { success: boolean; cart?: CartSummary; error?: string } {
  const cart = masterCartDatabase.get(sessionId);
  if (!cart) {
    return { success: false, error: 'Cart not found.' };
  }

  cart.items = cart.items.filter((i) => i.id !== itemId);
  cart.updatedAt = new Date().toISOString();

  return { success: true, cart: revalidateCart(cart) };
}

/**
 * Clear all items from cart
 */
export function clearCart(sessionId: string): { success: boolean; cart?: CartSummary } {
  let cart = masterCartDatabase.get(sessionId);
  if (!cart) {
    cart = {
      id: `cart_${Date.now()}`,
      guestSessionId: sessionId,
      items: [],
      appliedCoupon: null,
      updatedAt: new Date().toISOString(),
    };
    masterCartDatabase.set(sessionId, cart);
  } else {
    cart.items = [];
    cart.appliedCoupon = null;
    cart.updatedAt = new Date().toISOString();
  }

  return { success: true, cart: revalidateCart(cart) };
}

/**
 * Apply a promotional coupon code
 */
export function applyCartCoupon(
  sessionId: string,
  couponCode: string
): { success: boolean; cart?: CartSummary; error?: string } {
  const cleanCode = (couponCode || '').trim().toUpperCase();
  const cart = masterCartDatabase.get(sessionId);
  if (!cart) {
    return { success: false, error: 'Cart not found.' };
  }

  if (cleanCode === 'VUYYURU2026') {
    cart.appliedCoupon = 'VUYYURU2026';
    cart.updatedAt = new Date().toISOString();
    return { success: true, cart: revalidateCart(cart) };
  }

  return {
    success: false,
    error: 'Invalid or expired promotional code. Workshop pricing is already direct-to-customer without retail markups.',
  };
}

/**
 * Remove an applied coupon
 */
export function removeCartCoupon(sessionId: string): { success: boolean; cart?: CartSummary } {
  const cart = masterCartDatabase.get(sessionId);
  if (cart) {
    cart.appliedCoupon = null;
    cart.updatedAt = new Date().toISOString();
  }
  return { success: true, cart: revalidateCart(cart || { id: '', guestSessionId: sessionId, items: [], updatedAt: '' }) };
}

// =============================================================
// Screen 11: Checkout & Booking Store & Authoritative Engine
// =============================================================

export const configuredFulfilmentOptions: FulfilmentOption[] = [
  {
    id: 'workshop_collection',
    name: 'Workshop Pickup (Direct from Vuyyuru)',
    description: 'Inspect and collect your finished timber furniture directly from our workshop at Main Bazar Road, Vuyyuru.',
    pricePaise: 0,
    estimatedDays: 'Ready in 3–5 working days',
    requiresAddress: false,
    notes: 'Meet the artisans and inspect timber joinery personally before transport.',
  },
  {
    id: 'local_delivery',
    name: 'Local Workshop Delivery (Vuyyuru Town & Mandal)',
    description: 'Complimentary safe blanket-wrapped workshop transport to your home doorstep in Vuyyuru.',
    pricePaise: 0,
    estimatedDays: '3–6 working days',
    requiresAddress: true,
    notes: 'Ground floor / lift access transit included. Handled carefully by our crew.',
  },
  {
    id: 'delivery_installation',
    name: 'Delivery + Professional Carpenter Installation',
    description: 'Direct delivery plus on-site bed assembly, alignment, levelling, and hardware tightening by master joiners.',
    pricePaise: 0,
    estimatedDays: '4–7 working days',
    requiresAddress: true,
    notes: 'Complimentary installation for qualifying solid wood beds in Vuyyuru mandal.',
  },
];

export function getFulfilmentOptions(): FulfilmentOption[] {
  return [...configuredFulfilmentOptions];
}

// In-memory master order store and idempotency cache
export const masterOrdersDatabase = new Map<string, OrderRecord>();
export const idempotencyStore = new Map<string, string>(); // idempotencyKey -> orderId
export const masterSiteVisitBookings = new Map<string, SiteVisitRequestRecord>();

/**
 * Revalidate cart and return authoritative server totals for checkout
 */
export function validateCheckoutCart(
  guestSessionId: string,
  fulfilmentMethod: FulfilmentMethod = 'local_delivery',
  couponCode?: string
): CheckoutValidationResponse {
  const cartSummary = getCart(guestSessionId);

  // If coupon passed, ensure it is applied if valid
  if (couponCode && !cartSummary.appliedCouponCode) {
    applyCartCoupon(guestSessionId, couponCode);
  }

  const updatedCart = getCart(guestSessionId);
  const changes: string[] = [];

  // Check empty cart
  if (updatedCart.items.length === 0) {
    return {
      valid: false,
      currency: 'INR',
      items: [],
      subtotalPaise: 0,
      deliveryPaise: 0,
      installationPaise: 0,
      taxPaise: 0,
      discountPaise: 0,
      totalPaise: 0,
      changes: ['Your cart is empty. Add eligible fixed-price products before checking out.'],
      canCheckout: false,
      policyNotice: 'Cannot initiate checkout with an empty cart.',
    };
  }

  // Check ineligible items
  const ineligible = updatedCart.items.filter((i) => !i.isEligible);
  if (ineligible.length > 0) {
    ineligible.forEach((item) => {
      changes.push(`"${item.name}" is quote-only or custom and cannot be checked out online directly.`);
    });
  }

  // Re-verify current price freshness against master products
  for (const item of updatedCart.items) {
    const p = masterProductDatabase.find((x) => x.id === item.productId || x.slug === item.slug);
    if (p) {
      const currentPrice = p.salePricePaise || ((p.startingPrice || 0) * 100);
      if (currentPrice !== item.pricePaise) {
        changes.push(
          `Price for "${item.name}" was adjusted to current timber rate of ₹${(currentPrice / 100).toLocaleString('en-IN')}.`
        );
      }
    }
  }

  // Check fulfilment option
  const option = configuredFulfilmentOptions.find((o) => o.id === fulfilmentMethod) || configuredFulfilmentOptions[1];
  const deliveryPaise = 0; // Transparent zero fee
  const installationPaise = option.id === 'delivery_installation' ? 0 : 0;
  const taxPaise = 0; // Included in prices
  const discountPaise = updatedCart.discountPaise || 0;
  const subtotalPaise = updatedCart.subtotalPaise;
  const totalPaise = Math.max(0, subtotalPaise + deliveryPaise + installationPaise + taxPaise - discountPaise);
  const canCheckout = updatedCart.items.length > 0 && ineligible.length === 0;

  return {
    valid: canCheckout,
    currency: 'INR',
    items: updatedCart.items,
    subtotalPaise,
    deliveryPaise,
    installationPaise,
    taxPaise,
    discountPaise,
    totalPaise,
    changes,
    canCheckout,
    policyNotice: 'Final checkout revalidates timber stock availability and workshop scheduling.',
  };
}

/**
 * Normalizes Indian mobile phone numbers
 */
function normalizeIndianPhone(rawPhone: string): string | null {
  if (!rawPhone) return null;
  const cleaned = rawPhone.replace(/\D/g, '');
  if (cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned)) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  }
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    const sub = cleaned.slice(1);
    if (/^[6-9]\d{9}$/.test(sub)) {
      return `+91 ${sub.slice(0, 5)} ${sub.slice(5)}`;
    }
  }
  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    const sub = cleaned.slice(2);
    if (/^[6-9]\d{9}$/.test(sub)) {
      return `+91 ${sub.slice(0, 5)} ${sub.slice(5)}`;
    }
  }
  return null;
}

/**
 * Create an authoritative fixed-price order with server recalculation and idempotency
 */
export function createOrder(payload: CreateOrderPayload): {
  success: boolean;
  order?: OrderRecord;
  error?: string;
  statusCode?: number;
} {
  const { idempotencyKey, guestSessionId, contact, fulfilment, paymentMethod, orderNotes, termsAccepted } = payload;

  if (!idempotencyKey || typeof idempotencyKey !== 'string') {
    return { success: false, error: 'Idempotency key is required to prevent duplicate order placement.', statusCode: 400 };
  }

  // Idempotency check: if already processed, return existing order snapshot
  if (idempotencyStore.has(idempotencyKey)) {
    const existingOrderId = idempotencyStore.get(idempotencyKey)!;
    const existingOrder = masterOrdersDatabase.get(existingOrderId);
    if (existingOrder) {
      return { success: true, order: existingOrder };
    }
  }

  if (!termsAccepted) {
    return { success: false, error: 'Please accept the workshop crafting and delivery terms before proceeding.', statusCode: 400 };
  }

  if (!contact || !contact.name || contact.name.trim().length === 0) {
    return { success: false, error: 'Customer contact name is required.', statusCode: 400 };
  }

  const normalizedPhone = normalizeIndianPhone(contact.phone);
  if (!normalizedPhone) {
    return { success: false, error: 'Please enter a valid 10-digit Indian mobile number (e.g., 98480 12345).', statusCode: 400 };
  }

  // Validate fulfilment choice
  const validMethod = configuredFulfilmentOptions.find((o) => o.id === fulfilment?.method);
  if (!validMethod) {
    return { success: false, error: 'Invalid or unconfigured fulfilment method selected.', statusCode: 400 };
  }

  if (validMethod.requiresAddress) {
    if (!fulfilment.address?.area || fulfilment.address.area.trim().length === 0) {
      return { success: false, error: 'Delivery locality or area is required.', statusCode: 400 };
    }
    if (!fulfilment.address?.addressLine || fulfilment.address.addressLine.trim().length === 0) {
      return { success: false, error: 'Door/street delivery address is required.', statusCode: 400 };
    }
  }

  // Authoritatively load & validate cart
  const cartSummary = getCart(guestSessionId);
  if (!cartSummary || cartSummary.items.length === 0) {
    return { success: false, error: 'Your cart is empty. Cannot place an order without items.', statusCode: 400 };
  }

  // Reject if any item is ineligible or quote-only
  const ineligible = cartSummary.items.filter((i) => !i.isEligible);
  if (ineligible.length > 0) {
    return {
      success: false,
      error: 'Your cart contains custom or quote-only items. These require site measurement and written quotation and cannot be checked out online.',
      statusCode: 400,
    };
  }

  // Build immutable order item snapshots with authoritative server pricing
  const itemSnapshots: OrderItemSnapshot[] = [];
  let calculatedSubtotalPaise = 0;

  for (const item of cartSummary.items) {
    const product = masterProductDatabase.find((p) => p.id === item.productId || p.slug === item.slug);
    if (!product || product.status !== 'active' || product.priceMode !== 'fixed') {
      return {
        success: false,
        error: `Product "${item.name}" is no longer purchasable as fixed price. Please review your cart.`,
        statusCode: 400,
      };
    }

    const authoritativeUnitPricePaise = product.salePricePaise || ((product.startingPrice || 0) * 100);
    const lineTotalPaise = authoritativeUnitPricePaise * item.quantity;
    calculatedSubtotalPaise += lineTotalPaise;

    itemSnapshots.push({
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      category: (product as any)?.categoryName || (product as any)?.category || 'Solid Wood Furniture',
      image: product.primaryImage?.url || item.image,
      selectedWoodSpecies: item.selectedWoodSpecies,
      selectedFinish: item.selectedFinish,
      dimensionsSummary: product.dimensionsSummary,
      quantity: item.quantity,
      unitPricePaise: authoritativeUnitPricePaise,
      lineTotalPaise,
    });
  }

  // Authoritative charges & discount
  const deliveryChargesPaise = 0;
  const installationChargesPaise = 0;
  const taxPaise = 0;
  let discountPaise = 0;
  if (cartSummary.appliedCouponCode === 'VUYYURU2026') {
    discountPaise = Math.min(Math.round(calculatedSubtotalPaise * 0.05), 250000);
  }
  const totalPaise = Math.max(0, calculatedSubtotalPaise + deliveryChargesPaise + installationChargesPaise + taxPaise - discountPaise);

  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const orderId = `ord_${timestamp}_${randomSuffix}`;
  const orderReference = `VC-ORD-2026-${randomSuffix}`;
  const orderToken = `tok_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`;

  const orderRecord: OrderRecord = {
    id: orderId,
    orderReference,
    orderToken,
    guestSessionId,
    items: itemSnapshots,
    contact: {
      name: contact.name.trim(),
      phone: normalizedPhone,
      email: contact.email?.trim() || undefined,
    },
    fulfilment: {
      method: fulfilment.method,
      methodName: validMethod.name,
      address: validMethod.requiresAddress ? fulfilment.address : undefined,
      preferredSchedule: fulfilment.preferredSchedule,
      deliveryChargesPaise,
      installationChargesPaise,
    },
    pricing: {
      currency: 'INR',
      subtotalPaise: calculatedSubtotalPaise,
      deliveryChargesPaise,
      installationChargesPaise,
      taxPaise,
      discountPaise,
      appliedCouponCode: cartSummary.appliedCouponCode,
      totalPaise,
    },
    orderStatus: 'pending_review',
    paymentStatus: paymentMethod === 'pay_on_delivery' ? 'unpaid' : 'pending',
    paymentMethod,
    orderNotes: orderNotes?.trim()?.slice(0, 300) || undefined,
    termsAccepted: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  // Persist to in-memory store
  masterOrdersDatabase.set(orderId, orderRecord);
  idempotencyStore.set(idempotencyKey, orderId);

  // Clear guest cart once order is placed
  clearCart(guestSessionId);

  return { success: true, order: orderRecord };
}

/**
 * Fetch permitted order status with customer ownership verification
 */
export function getOrderById(
  orderId: string,
  orderToken?: string,
  guestSessionId?: string
): { success: boolean; order?: OrderRecord; error?: string; statusCode?: number } {
  const order = masterOrdersDatabase.get(orderId);
  if (!order) {
    return { success: false, error: 'Order not found.', statusCode: 404 };
  }

  // Privacy & Authorization check: verify token or guest session
  const tokenMatches = orderToken && order.orderToken === orderToken;
  const sessionMatches = guestSessionId && order.guestSessionId === guestSessionId;

  if (!tokenMatches && !sessionMatches) {
    return {
      success: false,
      error: 'Unauthorized: You do not have permission to view this order details.',
      statusCode: 403,
    };
  }

  return { success: true, order };
}

/**
 * Submit Mode B — Service Visit Request
 */
export function createSiteVisitBooking(payload: SiteVisitRequestPayload): {
  success: boolean;
  siteVisit?: SiteVisitRequestRecord;
  error?: string;
  statusCode?: number;
} {
  const {
    serviceId,
    workDescription,
    customerName,
    customerPhone,
    customerEmail,
    area,
    fullAddress,
    preferredDate,
    preferredTimeWindow,
    referencePhotosSummary,
    consentAccepted,
  } = payload;

  if (!consentAccepted) {
    return { success: false, error: 'Please accept consent for our carpenters to contact you regarding this visit.', statusCode: 400 };
  }

  if (!customerName || customerName.trim().length === 0) {
    return { success: false, error: 'Customer name is required.', statusCode: 400 };
  }

  const normalizedPhone = normalizeIndianPhone(customerPhone);
  if (!normalizedPhone) {
    return { success: false, error: 'Please provide a valid 10-digit Indian mobile number.', statusCode: 400 };
  }

  if (!workDescription || workDescription.trim().length < 5) {
    return { success: false, error: 'Please describe the carpentry or repair work needed (minimum 5 characters).', statusCode: 400 };
  }

  if (!area || area.trim().length === 0) {
    return { success: false, error: 'Locality or area in Vuyyuru/Krishna district is required.', statusCode: 400 };
  }

  if (!preferredDate) {
    return { success: false, error: 'Preferred visit date is required.', statusCode: 400 };
  }

  // Lookup service name
  const matchedService = masterServicesDatabase.find((s) => s.id === serviceId || s.slug === serviceId) || {
    name: 'General Carpentry Assessment',
  };

  const timestamp = Date.now();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `svr_${timestamp}_${randomSuffix}`;
  const reference = `VC-SVR-2026-${randomSuffix}`;

  const record: SiteVisitRequestRecord = {
    id,
    reference,
    serviceId,
    serviceName: matchedService.name,
    workDescription: workDescription.trim(),
    customer: {
      name: customerName.trim(),
      phone: normalizedPhone,
      email: customerEmail?.trim() || undefined,
    },
    location: {
      area: area.trim(),
      fullAddress: fullAddress?.trim() || undefined,
    },
    schedulePreference: {
      preferredDate,
      preferredTimeWindow: preferredTimeWindow || 'morning',
    },
    visitFeePolicy: {
      isComplimentary: true,
      feeDescription: 'Preliminary site inspection in Vuyyuru town & mandal is complimentary. Nominal travel reimbursement (₹200–₹300) applies only to outer locations and is credited against your final quotation.',
    },
    status: 'visit_pending_confirmation',
    statusLabel: 'Pending Confirmation',
    createdAt: new Date().toISOString(),
  };

  masterSiteVisitBookings.set(id, record);
  masterSiteVisitBookings.set(reference, record);

  return { success: true, siteVisit: record };
}

/**
 * Create or verify payment session
 */
export function createPaymentSession(request: PaymentSessionRequest): {
  success: boolean;
  session?: PaymentSessionResponse;
  error?: string;
  statusCode?: number;
} {
  const { orderId, orderToken, paymentMethod } = request;
  const order = masterOrdersDatabase.get(orderId);

  if (!order) {
    return { success: false, error: 'Order not found for payment session.', statusCode: 404 };
  }

  if (order.orderToken !== orderToken) {
    return { success: false, error: 'Unauthorized: Invalid order verification token.', statusCode: 403 };
  }

  if (paymentMethod === 'pay_on_delivery') {
    order.paymentStatus = 'unpaid';
    order.paymentMethod = 'pay_on_delivery';
    order.updatedAt = new Date().toISOString();

    return {
      success: true,
      session: {
        sessionId: `sess_cod_${Date.now()}`,
        orderId: order.id,
        orderReference: order.orderReference,
        amountPaise: order.pricing.totalPaise,
        currency: 'INR',
        status: 'completed',
        paymentMethod: 'pay_on_delivery',
        instructions: 'Pay via Cash or UPI directly to our delivery artisans upon furniture inspection.',
      },
    };
  }

  // Simulated advance UPI/Netbanking session
  const sessionId = `sess_upi_${Date.now()}`;
  return {
    success: true,
    session: {
      sessionId,
      orderId: order.id,
      orderReference: order.orderReference,
      amountPaise: order.pricing.totalPaise,
      currency: 'INR',
      status: 'initiated',
      paymentMethod: 'online_upi_advance',
      instructions: 'UPI payment session initiated. Server verifies transaction reference before updating order payment status.',
    },
  };
}

/**
 * Server-side payment verification (Never trust client redirect!)
 */
export function verifyServerPayment(
  orderId: string,
  orderToken: string,
  gatewayTransactionId: string,
  gatewayStatus: 'SUCCESS' | 'FAILED'
): { success: boolean; order?: OrderRecord; error?: string } {
  const order = masterOrdersDatabase.get(orderId);
  if (!order || order.orderToken !== orderToken) {
    return { success: false, error: 'Order not found or invalid token.' };
  }

  if (gatewayStatus === 'SUCCESS') {
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentDetails = {
      transactionId: gatewayTransactionId,
      paidAt: new Date().toISOString(),
      gatewayReference: `gw_${Date.now()}`,
    };
  } else {
    order.paymentStatus = 'failed';
  }

  order.updatedAt = new Date().toISOString();
  return { success: true, order };
}






