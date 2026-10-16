'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Trees,
  Truck,
  ShieldCheck,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { PublicProduct, SiteSettings } from '../../../types/api';
import { getProductBySlug, getSiteSettings, addItemToCart } from '../../../lib/api-client';
import { verifiedSiteSettings } from '../../../lib/public-data';

import { SiteHeader } from '../../../components/SiteHeader';
import { SiteFooter } from '../../../components/SiteFooter';
import { MobileContactAction } from '../../../components/MobileContactAction';
import { Breadcrumb } from '../../../components/catalogue/Breadcrumb';
import { PriceDisplay } from '../../../components/catalogue/PriceDisplay';
import { ProductCard } from '../../../components/ProductCard';
import { ImageGallery } from '../../../components/product-detail/ImageGallery';
import { DimensionConfigurator } from '../../../components/product-detail/DimensionConfigurator';
import { OptionsSelector } from '../../../components/product-detail/OptionsSelector';
import { ProductTabs } from '../../../components/product-detail/ProductTabs';
import { ProductEnquiryModal } from '../../../components/product-detail/ProductEnquiryModal';
import { LoadingSkeleton } from '../../../components/ui/LoadingSkeleton';
import { ErrorState } from '../../../components/ui/ErrorState';
import { Toast, ToastType } from '../../../components/ui/Toast';

interface ProductDetailClientProps {
  slug: string;
}

export function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(verifiedSiteSettings);
  const [product, setProduct] = useState<PublicProduct | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  // Configured options state
  const [selectedWood, setSelectedWood] = useState<string>('');
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [selectedSizeId, setSelectedSizeId] = useState<string | undefined>(undefined);
  const [customDimensions, setCustomDimensions] = useState<string | null>(null);
  const [isDimensionValid, setIsDimensionValid] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  // Modal & Toast states
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: ToastType; title: string; message: string }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Load Site Settings
  useEffect(() => {
    async function loadMeta() {
      try {
        const res = await getSiteSettings();
        setSettings(res.data);
      } catch (err) {
        console.warn('Failed to load site settings:', err);
      }
    }
    loadMeta();
  }, []);

  // Fetch Product Details
  const fetchProduct = useCallback(async () => {
    if (!slug) return;
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await getProductBySlug(slug);
      const data = res.data;
      setProduct(data);

      if (data) {
        const defaultWood =
          data.supportedWoodSpecies?.[0] || data.woodSpecies?.[0] || 'CP Teakwood';
        const defaultFinish =
          data.supportedFinishes?.[0] || data.finishType || 'Natural Teak Melamine Polish';
        const defaultSize = data.supportedSizes?.[0]?.id;

        setSelectedWood(defaultWood);
        setSelectedFinish(defaultFinish);
        setSelectedSizeId(defaultSize);
        setQuantity(1);
        setCustomDimensions(null);
        setIsDimensionValid(true);
      }
    } catch (err) {
      console.error('Failed to fetch product details:', err);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Handle Add-to-Cart for fixed price items
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addItemToCart({
        productId: product.id,
        quantity,
        selectedWoodSpecies: selectedWood,
        selectedFinish,
      });
      setToast({
        isOpen: true,
        type: 'success',
        title: 'Added to Cart',
        message: `${quantity}x ${product.name} added to your cart.`,
      });
      router.push('/cart');
    } catch (err: any) {
      setToast({
        isOpen: true,
        type: 'error',
        title: 'Could not add to cart',
        message: err.message || 'Failed to add item to cart.',
      });
    }
  };

  // WhatsApp Pre-filled message
  const getWhatsAppLink = () => {
    if (!product) return 'https://wa.me/918639731477';
    const text = encodeURIComponent(
      `Namaste Vuyyuru Carpentry, I would like to ask a question regarding ${product.name} (SKU: ${product.sku || 'N/A'}). ` +
      `Options: ${selectedWood}, ${selectedFinish}, Qty: ${quantity}.`
    );
    return `https://wa.me/918639731477?text=${text}`;
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#201A15]">
        <SiteHeader settings={settings} />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 space-y-8">
          <LoadingSkeleton variant="text" count={2} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <LoadingSkeleton variant="card" count={1} />
            <LoadingSkeleton variant="card" count={1} />
          </div>
        </main>
        <SiteFooter settings={settings} />
      </div>
    );
  }

  // 2. Error State (Network failure)
  if (isError) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#201A15]">
        <SiteHeader settings={settings} />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 flex items-center justify-center">
          <ErrorState
            title="Unable to load product specification"
            message="We could not connect to the workshop catalog. Please check your internet connection or retry."
            onRetry={fetchProduct}
          />
        </main>
        <SiteFooter settings={settings} />
      </div>
    );
  }

  // 3. Not Found State (Invalid slug, draft, or private product)
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#201A15]">
        <SiteHeader settings={settings} />
        <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 text-center">
          <div className="bg-white rounded-3xl border border-[#E5DDD1] p-10 sm:p-14 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF3EB] text-[#6B3F23] flex items-center justify-center mx-auto mb-4">
              <Trees className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#201A15] mb-2">
              Product Not Found
            </h1>
            <p className="text-sm text-[#5C4D41] max-w-md mx-auto leading-relaxed mb-8">
              The furniture item you are looking for may have been archived, discontinued, or is a private
              bespoke commission not visible to the public.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1E4D2B] text-white text-xs font-bold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Catalogue</span>
              </Link>
              <Link
                href="/custom-furniture"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FAF7F2] border border-[#E5DDD1] text-xs font-semibold text-[#201A15] hover:bg-[#EFE8DC] transition-colors focus-accessible"
              >
                <span>Request Custom Furniture</span>
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter settings={settings} />
      </div>
    );
  }

  // Determine Primary CTA text and action based on product.priceMode
  const renderPrimaryAction = () => {
    switch (product.priceMode) {
      case 'fixed':
        return (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isDimensionValid}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1E4D2B] text-white text-sm font-bold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs disabled:opacity-50"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Cart / Order Spec</span>
          </button>
        );

      case 'starting_from':
        return (
          <button
            type="button"
            onClick={() => setIsEnquiryModalOpen(true)}
            disabled={!isDimensionValid}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1E4D2B] text-white text-sm font-bold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Request Quotation for this Spec</span>
          </button>
        );

      case 'quote_required':
      default:
        return (
          <button
            type="button"
            onClick={() => setIsEnquiryModalOpen(true)}
            disabled={!isDimensionValid}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#1E4D2B] text-white text-sm font-bold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Request This Product</span>
          </button>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#201A15] relative pb-24 sm:pb-0">
      {/* 1. Header Navigation */}
      <SiteHeader settings={settings} />

      <main id="main-content" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-6 space-y-10">
        {/* 2. Breadcrumbs */}
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            { label: product.categoryName, href: `/products?category=${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        {/* 3. Main Product Showcase (2-Column Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Image Gallery (7 cols) */}
          <div className="lg:col-span-7">
            <ImageGallery
              productName={product.name}
              primaryImage={product.primaryImage}
              galleryImages={product.galleryImages}
              categoryName={product.categoryName}
            />
          </div>

          {/* Right Column: Product Overview, Pricing & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header: Category Badge & Product Title */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <Link
                  href={`/products?category=${product.categorySlug}`}
                  className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B] bg-[#E8F2EC] px-3 py-1 rounded-full hover:bg-[#D7E8DC] transition-colors"
                >
                  {product.categoryName}
                </Link>
                {product.sku && (
                  <span className="text-[11px] font-mono text-[#8C7E72] bg-white border border-[#E5DDD1] px-2 py-0.5 rounded-md">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15] tracking-tight leading-tight">
                {product.name}
              </h1>

              <p className="text-xs sm:text-sm text-[#5C4D41] mt-2.5 leading-relaxed">
                {product.shortDescription}
              </p>
            </div>

            {/* Price Box & Price Mode Policy Notice */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E5DDD1] shadow-2xs space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7E72] block mb-0.5">
                    Pricing Mode
                  </span>
                  <PriceDisplay
                    priceMode={product.priceMode}
                    salePricePaise={product.salePricePaise}
                    startingPricePaise={product.startingPricePaise}
                    startingPrice={product.startingPrice}
                    size="lg"
                  />
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-[#8C7E72] block mb-0.5">
                    Lead Time
                  </span>
                  <span className="text-xs font-bold text-[#1E4D2B]">
                    {product.leadTimeWeeks ? `${product.leadTimeWeeks} weeks` : 'Made to Order'}
                  </span>
                </div>
              </div>

              {/* Explicit Pricing Policy Language */}
              <div className="pt-2 border-t border-[#F0EAE1] text-[11px] text-[#5C4D41] leading-relaxed">
                {product.priceMode === 'fixed' && (
                  <span>
                    ✓ Fixed public sale price for standard workshop specifications. White-glove delivery and room assembly included in Vuyyuru and Vijayawada.
                  </span>
                )}
                {product.priceMode === 'starting_from' && (
                  <span>
                    ℹ Baseline starting price covers standard sizing in seasoned Ghana teak. Custom dimensions, Burma teak upgrades, or specialized polishes will be detailed in your formal quotation.
                  </span>
                )}
                {product.priceMode === 'quote_required' && (
                  <span>
                    ℹ Custom quote required. Price and timber volume depend on room dimensions, vastu layout, and architectural wood species.
                  </span>
                )}
              </div>
            </div>

            {/* Dimension Configurator */}
            <DimensionConfigurator
              dimensions={product.dimensions}
              defaultSummary={product.dimensionsSummary}
              onChangeCustomDimensions={(customStr, isValid) => {
                setCustomDimensions(customStr);
                setIsDimensionValid(isValid);
              }}
            />

            {/* Options Selector: Timber, Finish, Size, Quantity */}
            <div className="bg-white rounded-2xl border border-[#E5DDD1] p-5 shadow-2xs">
              <OptionsSelector
                woodSpeciesList={product.supportedWoodSpecies || product.woodSpecies || []}
                selectedWood={selectedWood}
                onSelectWood={setSelectedWood}
                finishesList={product.supportedFinishes || [product.finishType || 'Natural Teak Polish']}
                selectedFinish={selectedFinish}
                onSelectFinish={setSelectedFinish}
                sizesList={product.supportedSizes}
                selectedSizeId={selectedSizeId}
                onSelectSize={setSelectedSizeId}
                quantity={quantity}
                onChangeQuantity={setQuantity}
                maxQuantity={10}
              />
            </div>

            {/* Action Buttons: Primary & Secondary */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-3">
                {renderPrimaryAction()}

                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-[#E5DDD1] text-xs font-semibold text-[#201A15] hover:bg-[#EFE8DC] transition-colors focus-accessible shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Ask a Question</span>
                </a>
              </div>

              {/* Delivery and Warranty Micro-badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#5C4D41]">
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E5DDD1]">
                  <Truck className="w-3.5 h-3.5 text-[#1E4D2B] shrink-0" />
                  <span>Local delivery & assembly</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E5DDD1]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#1E4D2B] shrink-0" />
                  <span>Anti-termite wood guarantee</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Tabbed Information Section */}
        <ProductTabs
          product={product}
          orderingSteps={product.orderingSteps || []}
        />

        {/* 5. Related Products Section */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <section className="pt-6 border-t border-[#E5DDD1] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B3F23]">
                  Handcrafted In Our Workshop
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#201A15]">
                  Related Pieces You May Like
                </h2>
              </div>
              <Link
                href={`/products?category=${product.categorySlug}`}
                className="text-xs font-semibold text-[#1E4D2B] hover:underline flex items-center gap-1"
              >
                <span>View all {product.categoryName}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 6. Footer & Mobile Contact */}
      <SiteFooter settings={settings} />
      <MobileContactAction contact={settings.contact} />

      {/* 7. Product Custom Enquiry Modal */}
      <ProductEnquiryModal
        product={product}
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        selectedWood={selectedWood}
        selectedFinish={selectedFinish}
        selectedDimensions={customDimensions}
        quantity={quantity}
      />

      {/* 8. Toast Feedback */}
      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
