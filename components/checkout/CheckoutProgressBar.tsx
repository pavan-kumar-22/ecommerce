'use client';

import React from 'react';
import { User, Truck, CreditCard, CheckCircle2 } from 'lucide-react';

export type CheckoutStep = 1 | 2 | 3 | 4;

interface CheckoutProgressBarProps {
  currentStep: CheckoutStep;
  onStepClick?: (step: CheckoutStep) => void;
  maxAccessibleStep?: CheckoutStep;
}

export const CheckoutProgressBar: React.FC<CheckoutProgressBarProps> = ({
  currentStep,
  onStepClick,
  maxAccessibleStep = 3,
}) => {
  const steps = [
    { number: 1 as CheckoutStep, label: 'Contact', icon: User },
    { number: 2 as CheckoutStep, label: 'Fulfilment', icon: Truck },
    { number: 3 as CheckoutStep, label: 'Review & Pay', icon: CreditCard },
    { number: 4 as CheckoutStep, label: 'Confirmation', icon: CheckCircle2 },
  ];

  return (
    <nav aria-label="Checkout Progress" className="w-full mb-8">
      <ol className="flex items-center justify-between relative">
        {/* Background connector line */}
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-stone-200 -z-0"
          aria-hidden="true"
        />
        {/* Active connector fill */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-amber-700 transition-all duration-300 -z-0"
          style={{
            width: `${((Math.min(currentStep, 4) - 1) / (steps.length - 1)) * 100}%`,
          }}
          aria-hidden="true"
        />

        {steps.map((step) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.number;
          const isCurrent = currentStep === step.number;
          const isClickable = onStepClick && step.number <= maxAccessibleStep && currentStep !== 4;

          return (
            <li key={step.number} className="relative z-10 flex flex-col items-center">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick(step.number)}
                aria-current={isCurrent ? 'step' : undefined}
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-200 border-2 ${
                  isCurrent
                    ? 'bg-amber-800 text-white border-amber-800 ring-4 ring-amber-100 shadow-sm'
                    : isCompleted
                    ? 'bg-amber-600 text-white border-amber-600 hover:bg-amber-700'
                    : 'bg-white text-stone-400 border-stone-300'
                } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-white" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </button>
              <span
                className={`mt-2 text-xs font-medium tracking-tight ${
                  isCurrent
                    ? 'text-amber-900 font-bold'
                    : isCompleted
                    ? 'text-stone-800'
                    : 'text-stone-400'
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
