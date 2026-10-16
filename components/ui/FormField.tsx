import React from 'react';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  required = false,
  hint,
  error,
  children,
  className = '',
}) => {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label
          htmlFor={id}
          className="block text-xs font-semibold text-[#201A15]"
        >
          {label}
          {required && (
            <span className="text-[#C14436] ml-1" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {hint && (
          <span id={hintId} className="text-[11px] text-[#8C7E72]">
            {hint}
          </span>
        )}
      </div>

      <div className="relative">{children}</div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-xs font-medium text-[#C14436] flex items-center gap-1 mt-1"
        >
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};
