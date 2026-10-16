'use client';

import React from 'react';
import { Check, ClipboardList, Ruler, MapPin, UserCheck } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
  maxCompletedStep: number;
}

const STEPS = [
  { step: 1, title: 'Project Requirements', subtitle: 'Type, room & description', icon: ClipboardList },
  { step: 2, title: 'Dimensions & Wood', subtitle: 'Sizes in mm & finishes', icon: Ruler },
  { step: 3, title: 'Photos & Site Visit', subtitle: 'Images & visit survey', icon: MapPin },
  { step: 4, title: 'Contact & Consent', subtitle: 'Details & review', icon: UserCheck },
];

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onStepClick,
  maxCompletedStep,
}) => {
  return (
    <div className="w-full bg-white border border-[#E5DDD1] rounded-2xl p-4 sm:p-6 shadow-xs mb-8">
      {/* Mobile Step Counter */}
      <div className="md:hidden flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#8B5A2B]">
            Step {currentStep} of 4
          </span>
          <h2 className="text-base font-bold text-[#201A15]">
            {STEPS[currentStep - 1].title}
          </h2>
          <p className="text-xs text-[#5C4D41]">
            {STEPS[currentStep - 1].subtitle}
          </p>
        </div>
        <div className="w-12 h-12 rounded-full border-4 border-[#2D6A4F] flex items-center justify-center font-bold text-sm text-[#2D6A4F]">
          {Math.round((currentStep / 4) * 100)}%
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden w-full bg-[#F3ECE2] h-2 rounded-full overflow-hidden">
        <div
          className="bg-[#2D6A4F] h-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / 4) * 100}%` }}
        />
      </div>

      {/* Desktop Stepper */}
      <nav aria-label="Custom Furniture Wizard Progress" className="hidden md:block">
        <ol className="grid grid-cols-4 gap-4">
          {STEPS.map((s) => {
            const isCompleted = s.step < currentStep || s.step <= maxCompletedStep;
            const isCurrent = s.step === currentStep;
            const isClickable = s.step <= maxCompletedStep || s.step <= currentStep;
            const Icon = s.icon;

            return (
              <li key={s.step} className="relative">
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(s.step)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-start gap-3 border ${
                    isCurrent
                      ? 'bg-[#F9F5EF] border-[#8B5A2B] ring-2 ring-[#8B5A2B]/20 shadow-xs'
                      : isCompleted
                      ? 'bg-white border-[#E5DDD1] hover:border-[#8B5A2B]/40 hover:bg-[#FAF7F2] cursor-pointer'
                      : 'bg-[#FAF7F2]/60 border-transparent text-[#8C7E72] opacity-70 cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isCurrent
                        ? 'bg-[#8B5A2B] text-white shadow-xs'
                        : isCompleted
                        ? 'bg-[#E8F2EC] text-[#2D6A4F]'
                        : 'bg-[#E5DDD1] text-[#8C7E72]'
                    }`}
                  >
                    {isCompleted && !isCurrent ? (
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Icon className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider ${
                          isCurrent
                            ? 'text-[#8B5A2B]'
                            : isCompleted
                            ? 'text-[#2D6A4F]'
                            : 'text-[#8C7E72]'
                        }`}
                      >
                        Step 0{s.step}
                      </span>
                    </div>
                    <div
                      className={`text-sm font-semibold truncate ${
                        isCurrent ? 'text-[#201A15]' : isCompleted ? 'text-[#201A15]' : 'text-[#8C7E72]'
                      }`}
                    >
                      {s.title}
                    </div>
                    <div className="text-[11px] text-[#5C4D41] truncate">
                      {s.subtitle}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
};
