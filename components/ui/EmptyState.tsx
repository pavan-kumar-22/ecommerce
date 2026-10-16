import React from 'react';
import Link from 'next/link';
import { PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  message: string;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  actionText,
  actionHref,
  onActionClick,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[#FDFBF7] border border-[#E5DDD1] rounded-2xl ${className}`}
      role="region"
      aria-label={title}
    >
      <div className="w-14 h-14 rounded-full bg-[#EFE8DC] flex items-center justify-center text-[#6B3F23] mb-4">
        <PackageOpen className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-[#201A15] mb-2">{title}</h3>
      <p className="text-sm text-[#5C4D41] max-w-md mb-6">{message}</p>
      {actionText && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium bg-[#1E4D2B] text-white hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-sm"
        >
          {actionText}
        </Link>
      )}
      {actionText && !actionHref && onActionClick && (
        <button
          onClick={onActionClick}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-medium bg-[#1E4D2B] text-white hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
