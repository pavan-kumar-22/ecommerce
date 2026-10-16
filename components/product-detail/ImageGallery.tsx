'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, Wrench } from 'lucide-react';
import { ProductGalleryAsset } from '../../types/api';

interface ImageGalleryProps {
  productName: string;
  primaryImage: { url: string; alt: string } | null;
  galleryImages?: ProductGalleryAsset[];
  categoryName?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  productName,
  primaryImage,
  galleryImages = [],
  categoryName = 'Handcrafted Woodwork',
}) => {
  // Combine primary and gallery images into a single list
  const allImages: ProductGalleryAsset[] = [];
  if (primaryImage) {
    allImages.push({
      url: primaryImage.url,
      alt: primaryImage.alt || productName,
      caption: 'Workshop showcase view',
    });
  }
  if (galleryImages && galleryImages.length > 0) {
    galleryImages.forEach((img) => {
      // Avoid duplicate primary URL
      if (!primaryImage || img.url !== primaryImage.url) {
        allImages.push(img);
      }
    });
  }

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);

  const totalImages = allImages.length;

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  }, [totalImages]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  }, [totalImages]);

  // Keyboard navigation when gallery is in focus
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'Escape' && isZoomOpen) {
      setIsZoomOpen(false);
    }
  };

  // Close zoom modal on escape key
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsZoomOpen(false);
    };
    if (isZoomOpen) {
      window.addEventListener('keydown', handleGlobalKey);
      return () => window.removeEventListener('keydown', handleGlobalKey);
    }
  }, [isZoomOpen]);

  // 1. Fallback State: No image available
  if (totalImages === 0) {
    return (
      <div
        className="w-full aspect-4/3 rounded-3xl bg-[#EFE8DC] border border-[#E5DDD1] flex flex-col items-center justify-center p-8 text-center shadow-2xs"
        data-testid="image-fallback"
        role="region"
        aria-label="Product image placeholder"
      >
        <div className="w-16 h-16 rounded-2xl bg-[#DFD3C3] flex items-center justify-center text-[#6B3F23] mb-3 shadow-inner">
          <Wrench className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-wider font-bold text-[#8C7E72] mb-1">
          {categoryName}
        </span>
        <h3 className="text-base font-bold text-[#201A15]">{productName}</h3>
        <p className="text-xs text-[#5C4D41] mt-1 max-w-xs">
          Built custom to order in our Vuyyuru workshop. Timber grains and joinery inspection available on site.
        </p>
      </div>
    );
  }

  const activeImage = allImages[activeIndex];

  return (
    <div
      className="space-y-4"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label={`Photo gallery for ${productName}`}
    >
      {/* 2. Main Active Image Container */}
      <div className="relative aspect-4/3 sm:aspect-16/10 rounded-3xl overflow-hidden bg-[#201A15] border border-[#E5DDD1] shadow-xs group">
        <Image
          src={activeImage.url}
          alt={activeImage.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          priority
          className="object-cover transition-transform duration-300 group-hover:scale-102"
        />

        {/* Subtle Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Top-Right Zoom Button */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/90 backdrop-blur-xs text-[#201A15] hover:bg-white transition-colors focus-accessible shadow-sm"
          aria-label="Enlarge image view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Left / Right Navigation Buttons (if more than 1 image) */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-[#201A15] hover:bg-white transition-transform hover:scale-110 focus-accessible shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-[#201A15] hover:bg-white transition-transform hover:scale-110 focus-accessible shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Bottom Caption and Index Indicator */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white pointer-events-none">
          <p className="text-xs font-medium drop-shadow-md truncate max-w-xs sm:max-w-md">
            {activeImage.caption || activeImage.alt}
          </p>
          {totalImages > 1 && (
            <span className="text-[11px] font-semibold bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-xs shrink-0">
              {activeIndex + 1} / {totalImages}
            </span>
          )}
        </div>
      </div>

      {/* 3. Thumbnails Navigation */}
      {totalImages > 1 && (
        <div
          className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1"
          role="tablist"
          aria-label="Image gallery thumbnails"
        >
          {allImages.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`View image ${idx + 1} of ${totalImages}: ${img.alt}`}
                onClick={() => setActiveIndex(idx)}
                className={`relative w-20 h-16 sm:w-24 sm:h-20 rounded-2xl overflow-hidden shrink-0 border-2 transition-all focus-accessible shadow-2xs ${
                  isSelected
                    ? 'border-[#1E4D2B] ring-2 ring-[#1E4D2B]/30 scale-102'
                    : 'border-[#E5DDD1] opacity-70 hover:opacity-100 hover:border-[#6B3F23]'
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  sizes="100px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* 4. Fullscreen Zoom Modal */}
      {isZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged view: ${activeImage.alt}`}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <button
            type="button"
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors focus-accessible"
            aria-label="Close enlarged view"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
            <Image
              src={activeImage.url}
              alt={activeImage.alt}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </div>

          <p className="text-sm font-medium text-white/90 mt-4 text-center">
            {activeImage.caption || activeImage.alt}
          </p>
        </div>
      )}
    </div>
  );
};
