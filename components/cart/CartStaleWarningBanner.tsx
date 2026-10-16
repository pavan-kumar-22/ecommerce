import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface CartStaleWarningBannerProps {
  message: string;
  onRefresh?: () => void;
}

export const CartStaleWarningBanner: React.FC<CartStaleWarningBannerProps> = ({
  message,
  onRefresh,
}) => {
  return (
    <div
      role="alert"
      className="mb-6 p-4 sm:p-5 bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-[#92400E] shadow-xs"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-[#78350F] block mb-0.5">
            Cart Review Required (Price or Availability Change)
          </span>
          <span className="leading-relaxed">{message}</span>
        </div>
      </div>

      {onRefresh && (
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#FDE68A] bg-white text-xs font-bold text-[#78350F] hover:bg-[#FEF3C7] transition-colors shrink-0 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Acknowledge</span>
        </button>
      )}
    </div>
  );
};
