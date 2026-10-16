import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  isOpen: boolean;
  onClose: () => void;
  durationMs?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  isOpen,
  onClose,
  durationMs = 5000,
}) => {
  useEffect(() => {
    if (!isOpen || durationMs <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, durationMs);
    return () => clearTimeout(timer);
  }, [isOpen, durationMs, onClose]);

  if (!isOpen) return null;

  const styles = {
    success: {
      bg: 'bg-[#E8F2EC] border-[#1E4D2B]/30 text-[#1E4D2B]',
      icon: <CheckCircle2 className="w-5 h-5 text-[#1E4D2B] shrink-0" />,
    },
    error: {
      bg: 'bg-[#FDF2F0] border-[#C14436]/30 text-[#C14436]',
      icon: <AlertTriangle className="w-5 h-5 text-[#C14436] shrink-0" />,
    },
    info: {
      bg: 'bg-[#FAF3EB] border-[#6B3F23]/30 text-[#6B3F23]',
      icon: <Info className="w-5 h-5 text-[#6B3F23] shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-lg ${current.bg}`}
      >
        {current.icon}
        <div className="flex-1">
          <h4 className="text-sm font-bold">{title}</h4>
          {message && <p className="text-xs mt-0.5 opacity-90">{message}</p>}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
