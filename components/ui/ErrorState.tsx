import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Couldn't load this section",
  message = 'There was a temporary problem retrieving information. Please retry or check back shortly.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`p-6 sm:p-8 bg-[#FFF9F6] border border-[#F3D7CD] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FCECE6] flex items-center justify-center text-[#C04928] shrink-0">
          <AlertCircle className="w-5 h-5" aria-hidden="true" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-[#3A1E14]">{title}</h4>
          <p className="text-xs text-[#7A5B52] mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E0D0C7] hover:bg-[#F9F5F2] text-[#3E2312] text-xs font-medium rounded-lg transition-colors focus-accessible shadow-xs shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
