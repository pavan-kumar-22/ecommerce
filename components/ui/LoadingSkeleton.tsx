import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'card' | 'text' | 'hero' | 'avatar' | 'rect';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  variant = 'rect',
  count = 1,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'card':
        return 'h-72 w-full rounded-2xl';
      case 'hero':
        return 'h-96 w-full rounded-3xl';
      case 'text':
        return 'h-4 w-3/4 rounded-md';
      case 'avatar':
        return 'h-12 w-12 rounded-full';
      case 'rect':
      default:
        return 'h-24 w-full rounded-xl';
    }
  };

  return (
    <div className="space-y-3" role="status" aria-label="Loading content...">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse bg-[#EFE8DC] ${getVariantStyles()} ${className}`}
        />
      ))}
      <span className="sr-only">Loading...</span>
    </div>
  );
};
