'use client';

import React from 'react';
import {
  User,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { PreferredContactMethod } from '@/types/api';
import { Step1FormData } from './Step1Requirements';
import { Step2FormData } from './Step2Dimensions';
import { Step3FormData } from './Step3SitePhotos';

export interface Step4FormData {
  name: string;
  phone: string;
  whatsappAvailable: boolean;
  email?: string;
  preferredContactMethod: PreferredContactMethod;
  consent: boolean;
  marketingOptIn: boolean;
}

interface Step4Props {
  data: Step4FormData;
  step1Data: Step1FormData;
  step2Data: Step2FormData;
  step3Data: Step3FormData;
  onChange: (updates: Partial<Step4FormData>) => void;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  errors: Record<string, string>;
}

export const Step4ContactConsent: React.FC<Step4Props> = ({
  data,
  step1Data,
  step2Data,
  step3Data,
  onChange,
  onEditStep,
  onSubmit,
  onBack,
  isSubmitting,
  submitError,
  errors,
}) => {
  // Format dimension label
  const dimensionSummary = () => {
    if (step2Data.confidence === 'not_sure') {
      return 'Dimensions to be measured on site by carpenter';
    }
    const parts = [];
    if (step2Data.widthMm) parts.push(`W: ${step2Data.widthMm}mm`);
    if (step2Data.heightMm) parts.push(`H: ${step2Data.heightMm}mm`);
    if (step2Data.depthMm) parts.push(`D: ${step2Data.depthMm}mm`);
    return parts.length > 0 ? parts.join(' × ') : 'Not specified';
  };

  const furnitureTypeLabel = () => {
    if (step1Data.furnitureType === 'other') {
      return step1Data.customFurnitureType || 'Custom Furniture';
    }
    return step1Data.furnitureType
      ? step1Data.furnitureType.replace('_', ' ').toUpperCase()
      : 'Custom Item';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-1">
          <span>Step 4 of 4</span>
          <span>·</span>
          <span>Contact & Final Review</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#201A15]">
          Your Contact Details and Consent
        </h2>
        <p className="text-sm text-[#5C4D41] mt-1 max-w-2xl">
          Review your requirements summary below, enter your phone number, and provide required contact consent. Our master artisan will follow up with quotation guidance.
        </p>
      </div>

      {/* Review Summary Card */}
      <div className="rounded-2xl border border-[#E5DDD1] bg-[#FAF7F2] p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E5DDD1] pb-3">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#2D6A4F]" />
            <h3 className="font-bold text-sm text-[#201A15]">Project Scope Summary</h3>
          </div>
          <span className="text-xs text-[#8C7E72]">Please verify before submitting</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          {/* Item & Room */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#8C7E72]">
              <span>Furniture Item</span>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="text-[#8B5A2B] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="font-bold text-sm text-[#201A15]">{furnitureTypeLabel()}</div>
            <div className="text-[#5C4D41]">Quantity: {step1Data.quantity || 1} unit(s)</div>
            {step1Data.room && <div className="text-[#5C4D41]">Room: {step1Data.room}</div>}
          </div>

          {/* Dimensions & Wood */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#8C7E72]">
              <span>Dimensions & Material</span>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="text-[#8B5A2B] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="font-semibold text-[#201A15]">{dimensionSummary()}</div>
            <div className="text-[#5C4D41] capitalize">
              Timber: {step2Data.materialPreference ? step2Data.materialPreference.replace(/_/g, ' ') : 'Advise me'}
            </div>
            <div className="text-[#5C4D41] capitalize">
              Finish: {step2Data.finishPreference ? step2Data.finishPreference.replace(/_/g, ' ') : 'Advise me'}
            </div>
          </div>

          {/* Site & Photos */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[#8C7E72]">
              <span>Site & Survey</span>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="text-[#8B5A2B] font-semibold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" /> Edit
              </button>
            </div>
            <div className="font-semibold text-[#201A15] truncate">{step3Data.area || 'Locality not specified'}</div>
            <div className="text-[#5C4D41]">
              Site Visit: {step3Data.visitRequested === 'yes' ? 'Requested' : step3Data.visitRequested === 'advise_me' ? 'Advise Me' : 'No (Workshop quote)'}
            </div>
            <div className="text-[#5C4D41]">
              Photos: {step3Data.referencePhotos?.length || 0} attached
            </div>
          </div>
        </div>
      </div>

      {/* 1. Customer Name */}
      <div className="space-y-2">
        <label htmlFor="customerName" className="block text-sm font-bold text-[#201A15]">
          Your Name <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="customerName"
            type="text"
            value={data.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Ramesh Varma"
            maxLength={100}
            className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
          />
          <User className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.name && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.name}
          </p>
        )}
      </div>

      {/* 2. Phone Number & WhatsApp Checkbox */}
      <div className="space-y-3">
        <div className="space-y-2">
          <label htmlFor="customerPhone" className="block text-sm font-bold text-[#201A15]">
            Mobile Phone Number (Indian) <span className="text-red-500">*</span>
          </label>
          <div className="flex rounded-lg border border-[#E5DDD1] bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#8B5A2B]">
            <span className="px-3.5 py-2.5 bg-[#FAF7F2] text-xs font-bold text-[#5C4D41] border-r border-[#E5DDD1] flex items-center gap-1">
              <span>🇮🇳</span>
              <span>+91</span>
            </span>
            <input
              id="customerPhone"
              type="tel"
              value={data.phone}
              onChange={(e) => onChange({ phone: e.target.value })}
              placeholder="98765 43210"
              maxLength={15}
              className="flex-1 px-3 py-2 text-sm bg-transparent outline-none font-medium"
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* WhatsApp Checkbox */}
        <label className="flex items-center gap-2.5 text-xs text-[#3E2312] cursor-pointer">
          <input
            type="checkbox"
            checked={data.whatsappAvailable}
            onChange={(e) => onChange({ whatsappAvailable: e.target.checked })}
            className="accent-[#2D6A4F] w-4 h-4 rounded"
          />
          <span>This phone number is available on WhatsApp for joinery drawings and photos</span>
        </label>
      </div>

      {/* 3. Optional Email */}
      <div className="space-y-2">
        <label htmlFor="customerEmail" className="block text-sm font-bold text-[#201A15]">
          Email Address <span className="text-xs font-normal text-[#8C7E72]">(Optional)</span>
        </label>
        <div className="relative">
          <input
            id="customerEmail"
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="ramesh@example.com"
            maxLength={100}
            className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
          />
          <Mail className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.email && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.email}
          </p>
        )}
      </div>

      {/* 4. Preferred Contact Method */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#201A15]">
          Preferred Contact Method <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'whatsapp', label: 'WhatsApp Message', desc: 'Fastest for sharing photos & 2D sketches' },
            { id: 'phone', label: 'Phone Call', desc: 'Direct conversation with master carpenter' },
            { id: 'email', label: 'Email Quotation', desc: 'Formal quotation PDF sent to your inbox' },
          ].map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange({ preferredContactMethod: method.id as PreferredContactMethod })}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                data.preferredContactMethod === method.id
                  ? 'border-[#2D6A4F] bg-[#E8F2EC]/40 ring-2 ring-[#2D6A4F]/20 font-semibold'
                  : 'border-[#E5DDD1] bg-white hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center gap-2 mb-0.5">
                <input
                  type="radio"
                  name="contactMethod"
                  checked={data.preferredContactMethod === method.id}
                  onChange={() =>
                    onChange({ preferredContactMethod: method.id as PreferredContactMethod })
                  }
                  className="accent-[#2D6A4F]"
                />
                <span className="text-xs sm:text-sm font-bold text-[#201A15]">{method.label}</span>
              </div>
              <p className="text-[11px] text-[#5C4D41] pl-5">{method.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Consents & Declarations */}
      <div className="space-y-3 pt-2">
        {/* Mandatory Enquiry Consent */}
        <div className="p-4 rounded-xl border border-[#E5DDD1] bg-white space-y-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="consentEnquiry"
              checked={data.consent}
              onChange={(e) => onChange({ consent: e.target.checked })}
              className="accent-[#2D6A4F] w-4 h-4 mt-0.5 rounded shrink-0"
            />
            <span className="text-xs text-[#201A15] leading-relaxed">
              <strong className="font-bold">Required Consent: </strong>
              I consent to Vuyyuru Carpentry storing my submitted furniture details and contacting me via my preferred method regarding this quotation request. I understand that this enquiry does not constitute an accepted order or guaranteed final price until site measurements and scope are confirmed.{' '}
              <span className="text-[#8B5A2B] underline font-medium">Privacy Notice v2026.1</span>
            </span>
          </label>

          {errors.consent && (
            <p className="text-xs text-red-600 flex items-center gap-1 pl-7">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.consent}
            </p>
          )}
        </div>

        {/* Separate Optional Marketing Opt-In (Unchecked by default) */}
        <div className="p-3.5 rounded-xl border border-dashed border-[#E5DDD1] bg-[#FAF7F2]">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              id="marketingOptIn"
              checked={data.marketingOptIn}
              onChange={(e) => onChange({ marketingOptIn: e.target.checked })}
              className="accent-[#8B5A2B] w-4 h-4 mt-0.5 rounded shrink-0"
            />
            <span className="text-xs text-[#5C4D41] leading-relaxed">
              <span className="font-semibold text-[#3E2312]">Optional Workshop Updates: </span>
              Keep me informed about seasonal seasoned timber arrivals, master craftsmanship exhibitions, and design trends in Andhra Pradesh (optional, separate from your enquiry).
            </span>
          </label>
        </div>
      </div>

      {/* Submission Error Banner */}
      {submitError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5 animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold">Unable to submit your request</div>
            <div>{submitError}</div>
            <div className="text-[11px] text-red-600">
              All your entered information has been preserved. Please review the highlighted fields or click submit again to retry.
            </div>
          </div>
        </div>
      )}

      {/* Form Controls */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD1]">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-2.5 rounded-xl border border-[#E5DDD1] bg-white text-[#5C4D41] hover:bg-[#FAF7F2] font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          id="submitCustomFurnitureBtn"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="px-7 py-3.5 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1E4D2B] font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-md hover-lift cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed focus-accessible"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting Request...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Submit Custom Furniture Request</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
