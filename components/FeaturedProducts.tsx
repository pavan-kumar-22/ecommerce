import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PublicProduct } from '../types/api';
import { ProductCard } from './ProductCard';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { EmptyState } from './ui/EmptyState';
import { ErrorState } from './ui/ErrorState';

interface FeaturedProductsProps {
  products: PublicProduct[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  return (
    <section
      className="py-16 sm:py-20 bg-[#FBF9F5] border-b border-[#E5DDD1]"
      aria-labelledby="featured-products-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6B3F23] block mb-2">
              Curated Furniture
            </span>
            <h2
              id="featured-products-heading"
              className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#201A15]"
            >
              Featured Workshop Designs
            </h2>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E4D2B] hover:text-[#2D6A4F] focus-accessible p-1 rounded-md group"
            id="browse-all-products-link"
          >
            <span>Browse complete catalogue</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* State 1: Loading */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={3} />
          </div>
        )}

        {/* State 2: Error */}
        {!isLoading && isError && (
          <ErrorState
            title="Unable to load featured products"
            message="We could not fetch active workshop pieces at this time. Please retry or browse the full catalogue directly."
            onRetry={onRetry}
          />
        )}

        {/* State 3: Empty */}
        {!isLoading && !isError && products.length === 0 && (
          <EmptyState
            title="No featured products currently listed"
            message="Our artisans are currently updating the active showroom pieces. You can still view our standard catalog or request a custom quote."
            actionText="Browse all products"
            actionHref="/products"
          />
        )}

        {/* State 4: Products Grid */}
        {!isLoading && !isError && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
