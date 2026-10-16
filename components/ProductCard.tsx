import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Hammer, ImageOff } from 'lucide-react';
import { PublicProduct } from '../types/api';
import { PriceDisplay } from './catalogue/PriceDisplay';

interface ProductCardProps {
  product: PublicProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    id,
    name,
    slug,
    shortDescription,
    categoryName,
    primaryImage,
    woodSpecies,
    priceMode,
    salePricePaise,
    startingPricePaise,
    startingPrice,
    currency,
    isCustomizable,
    availabilityLabel,
  } = product;

  return (
    <article
      className="group bg-white rounded-2xl border border-[#E5DDD1] overflow-hidden hover-lift flex flex-col h-full focus-within:ring-2 focus-within:ring-[#2D6A4F] shadow-2xs"
      data-testid={`product-card-${id}`}
    >
      {/* 1. Image Container with Designed Fallback */}
      <div className="relative aspect-4/3 w-full bg-[#EFE8DC] overflow-hidden">
        {primaryImage && primaryImage.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={primaryImage.url}
            alt={primaryImage.alt || name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          /* Designed fallback for missing imagery */
          <div
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#F5EFE6] to-[#EFE8DC] text-[#8C7E72]"
            data-testid="image-fallback"
          >
            <div className="w-12 h-12 rounded-full bg-[#E5DDD1]/70 flex items-center justify-center mb-2 text-[#6B3F23]">
              <Hammer className="w-6 h-6" aria-hidden="true" />
            </div>
            <span className="text-xs font-semibold text-[#5C4D41]">Crafted in Workshop</span>
            <span className="text-[10px] text-[#8C7E72] mt-0.5">Photograph in update</span>
          </div>
        )}

        {/* Customizable Badge */}
        {isCustomizable && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#1E4D2B] text-[11px] font-semibold px-2.5 py-1 rounded-full border border-[#D5E5DA] shadow-xs flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#2D6A4F]" aria-hidden="true" />
            Customizable
          </span>
        )}

        {/* Availability Label (e.g. Made to Order) */}
        {availabilityLabel && (
          <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full border border-white/20">
            {availabilityLabel}
          </span>
        )}
      </div>

      {/* 2. Card Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#6B3F23] mb-1.5">
          {categoryName}
        </div>

        <h3 className="text-base font-semibold text-[#201A15] group-hover:text-[#1E4D2B] transition-colors line-clamp-1 mb-1">
          <Link
            href={`/products/${slug}`}
            className="focus:outline-none focus:underline"
            id={`product-link-${id}`}
          >
            {name}
          </Link>
        </h3>

        {/* Short Description */}
        {shortDescription && (
          <p className="text-xs text-[#5C4D41] line-clamp-2 leading-relaxed mb-3">
            {shortDescription}
          </p>
        )}

        {/* Wood Species Pills */}
        {woodSpecies && woodSpecies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {woodSpecies.slice(0, 2).map((species, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-[#F5EFE6] text-[#5C4D41] px-2 py-0.5 rounded-md"
              >
                {species}
              </span>
            ))}
          </div>
        )}

        {/* 3. Price & Action Area */}
        <div className="mt-auto pt-4 border-t border-[#F0EAE1] flex items-center justify-between">
          <div>
            <PriceDisplay
              priceMode={priceMode}
              salePricePaise={salePricePaise}
              startingPricePaise={startingPricePaise}
              startingPrice={startingPrice}
              currency={currency}
              size="md"
            />
          </div>

          <Link
            href={`/products/${slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E4D2B] hover:text-[#2D6A4F] p-1 rounded-md focus-accessible group/btn"
            aria-label={`View details for ${name}`}
          >
            <span>View details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
};
