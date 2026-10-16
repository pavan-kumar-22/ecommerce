'use client';

import React from 'react';
import {
  Ruler,
  Info,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Link as LinkIcon,
  CheckSquare,
  Square,
  Sparkles,
} from 'lucide-react';
import { DimensionConfidence } from '@/types/api';

export interface Step2FormData {
  widthMm?: number;
  heightMm?: number;
  depthMm?: number;
  confidence: DimensionConfidence;
  materialPreference?: string;
  finishPreference?: string;
  colorPreference?: string;
  features?: string[];
  referenceUrl?: string;
}

interface Step2Props {
  data: Step2FormData;
  onChange: (updates: Partial<Step2FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

const MATERIAL_OPTIONS = [
  { value: 'burma_teak', label: 'Seasoned Burma Teak (Finest grain & golden luster)' },
  { value: 'cp_teak', label: 'CP Teakwood (Central Province — High structural density)' },
  { value: 'ghana_teak', label: 'Ghana Teak (Durable & cost-effective solid timber)' },
  { value: 'action_tesa_hdhmr', label: 'Action TESA HDHMR (High-density moisture-resistant core)' },
  { value: 'century_bwp_marine', label: 'Century Club Prime BWP 710 Marine Plywood' },
  { value: 'not_sure', label: 'Not sure — please advise based on my budget & room' },
];

const FINISH_OPTIONS = [
  { value: 'natural_melamine', label: 'Natural Teak Melamine Polish (Subtle sheen & grain enhancement)' },
  { value: 'matte_pu', label: 'Matte Polyurethane (PU) Clear Coat (Contemporary silky feel)' },
  { value: 'high_gloss_pu', label: 'Italian High-Gloss PU Spray Finish (Luxury showroom look)' },
  { value: 'textured_laminate', label: '1mm Anti-Scratch Textured Laminate (Merino / Century)' },
  { value: 'spirit_polish', label: 'Traditional Hand-Rubbed French Spirit Polish' },
  { value: 'not_sure', label: 'Not sure — please advise on best finishing option' },
];

const COLOR_PREFERENCES = [
  'Natural Honey Teak',
  'Deep Walnut Brown',
  'Antique Dark Teak',
  'Warm Golden Oak',
  'Natural Raw Matte',
  'Custom Tone (Match My Existing Furniture)',
];

const STORAGE_FEATURES = [
  { id: 'drawers', label: 'Soft-Close Drawers' },
  { id: 'shelves', label: 'Adjustable Internal Shelves' },
  { id: 'hanging_space', label: 'Heavy-Duty Hanging Rail' },
  { id: 'fluted_panelling', label: 'Fluted Wooden Slats / Louvers' },
  { id: 'glass_doors', label: 'Toughened Fluted / Tinted Glass Shutters' },
  { id: 'concealed_led', label: 'Concealed LED Strip Warm Grooves' },
  { id: 'brass_accents', label: 'Traditional Brass Handles & Hinges' },
  { id: 'godrej_lock', label: 'Integrated Godrej / Europa Lock' },
];

export const Step2Dimensions: React.FC<Step2Props> = ({
  data,
  onChange,
  onNext,
  onBack,
  errors,
}) => {
  const toggleFeature = (featureId: string) => {
    const current = data.features || [];
    if (current.includes(featureId)) {
      onChange({ features: current.filter((f) => f !== featureId) });
    } else {
      onChange({ features: [...current, featureId] });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-1">
          <span>Step 2 of 4</span>
          <span>·</span>
          <span>Dimensions & Preferences</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#201A15]">
          Dimensions and Timber Preferences
        </h2>
        <p className="text-sm text-[#5C4D41] mt-1 max-w-2xl">
          Enter rough dimensions in millimetres if known, or choose &ldquo;Not sure&rdquo;. We verify all measurements on site before cutting seasoned wood.
        </p>
      </div>

      {/* Dimension Rule Callout Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F9F5EF] border border-[#8B5A2B]/30 flex items-start gap-3.5 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-[#8B5A2B] shrink-0 mt-0.5" />
        <div className="text-xs sm:text-sm text-[#3E2312] leading-relaxed">
          <strong className="font-bold text-[#201A15]">Dimension Rule: </strong>
          Customer-entered dimensions are initial estimates for quotation guidance, not production blueprints. For fitted wardrobes, doors, and kitchens, our carpenter will conduct an on-site laser survey. Quotations remain provisional until final measurements and scope are approved in writing.
        </div>
      </div>

      {/* 1. Dimension Inputs in MM */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-[#201A15]">
            Approximate Dimensions <span className="text-xs font-normal text-[#8C7E72]">(Millimetres · Optional)</span>
          </label>
          <span className="text-xs text-[#8B5A2B] font-medium">Units: Millimetres (mm)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Width */}
          <div className="space-y-1.5">
            <label htmlFor="dimWidth" className="block text-xs font-bold text-[#5C4D41]">
              Width (mm)
            </label>
            <div className="relative">
              <input
                id="dimWidth"
                type="number"
                min={50}
                max={15000}
                placeholder="e.g. 1800"
                value={data.widthMm !== undefined ? data.widthMm : ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                  onChange({ widthMm: val });
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-xl focus-accessible focus:border-[#8B5A2B] pr-12 font-medium"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C7E72] pointer-events-none">
                mm
              </span>
            </div>
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <label htmlFor="dimHeight" className="block text-xs font-bold text-[#5C4D41]">
              Height (mm)
            </label>
            <div className="relative">
              <input
                id="dimHeight"
                type="number"
                min={50}
                max={15000}
                placeholder="e.g. 2100"
                value={data.heightMm !== undefined ? data.heightMm : ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                  onChange({ heightMm: val });
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-xl focus-accessible focus:border-[#8B5A2B] pr-12 font-medium"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C7E72] pointer-events-none">
                mm
              </span>
            </div>
          </div>

          {/* Depth */}
          <div className="space-y-1.5">
            <label htmlFor="dimDepth" className="block text-xs font-bold text-[#5C4D41]">
              Depth / Thickness (mm)
            </label>
            <div className="relative">
              <input
                id="dimDepth"
                type="number"
                min={20}
                max={5000}
                placeholder="e.g. 600"
                value={data.depthMm !== undefined ? data.depthMm : ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10);
                  onChange({ depthMm: val });
                }}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-xl focus-accessible focus:border-[#8B5A2B] pr-12 font-medium"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C7E72] pointer-events-none">
                mm
              </span>
            </div>
          </div>
        </div>

        {/* Conversion Helper */}
        <p className="text-[11px] text-[#8C7E72] flex items-center gap-1.5 pt-1">
          <Info className="w-3.5 h-3.5 shrink-0 text-[#8B5A2B]" />
          <span>Quick conversion: 1 foot ≈ 305 mm · 3 feet ≈ 914 mm · 6 feet ≈ 1828 mm · 7 feet ≈ 2134 mm</span>
        </p>

        {errors.dimensions && (
          <p className="text-xs text-red-600 mt-1">{errors.dimensions}</p>
        )}
      </div>

      {/* 2. Dimension Confidence */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#201A15]">
          Dimension Confidence <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'approximate',
              title: 'Approximate estimate',
              desc: 'Rough room size; site survey recommended',
            },
            {
              id: 'measured',
              title: 'Accurately measured',
              desc: 'Measured using tape / laser on site',
            },
            {
              id: 'not_sure',
              title: 'Not sure — Please advise',
              desc: 'Carpenter should inspect and measure',
            },
          ].map((conf) => (
            <button
              key={conf.id}
              type="button"
              onClick={() => onChange({ confidence: conf.id as DimensionConfidence })}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                data.confidence === conf.id
                  ? 'border-[#8B5A2B] bg-[#F9F5EF] ring-2 ring-[#8B5A2B]/20'
                  : 'border-[#E5DDD1] bg-white hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="confidence"
                  checked={data.confidence === conf.id}
                  onChange={() => onChange({ confidence: conf.id as DimensionConfidence })}
                  className="accent-[#8B5A2B]"
                />
                <span className="text-sm font-bold text-[#201A15]">{conf.title}</span>
              </div>
              <p className="text-xs text-[#5C4D41] pl-5">{conf.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Material Preference */}
      <div className="space-y-2">
        <label htmlFor="materialSelect" className="block text-sm font-bold text-[#201A15]">
          Material & Timber Preference <span className="text-xs font-normal text-[#8C7E72]">(Optional)</span>
        </label>
        <select
          id="materialSelect"
          value={data.materialPreference || 'not_sure'}
          onChange={(e) => onChange({ materialPreference: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
        >
          {MATERIAL_OPTIONS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Finish Preference */}
      <div className="space-y-2">
        <label htmlFor="finishSelect" className="block text-sm font-bold text-[#201A15]">
          Finish Preference <span className="text-xs font-normal text-[#8C7E72]">(Optional)</span>
        </label>
        <select
          id="finishSelect"
          value={data.finishPreference || 'not_sure'}
          onChange={(e) => onChange({ finishPreference: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
        >
          {FINISH_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* 5. Colour / Shade Preference */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#201A15]">
          Wood Shade or Tone <span className="text-xs font-normal text-[#8C7E72]">(Optional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {COLOR_PREFERENCES.map((color) => {
            const isSelected = data.colorPreference === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ colorPreference: isSelected ? '' : color })}
                className={`px-3 py-1.5 text-xs rounded-full border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#8B5A2B] bg-[#8B5A2B] text-white font-bold'
                    : 'border-[#E5DDD1] bg-white text-[#5C4D41] hover:border-[#8B5A2B]/40'
                }`}
              >
                {color}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Storage & Feature Checkboxes */}
      <div className="space-y-2.5">
        <label className="block text-sm font-bold text-[#201A15]">
          Desired Features & Hardware <span className="text-xs font-normal text-[#8C7E72]">(Select all that apply)</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {STORAGE_FEATURES.map((feature) => {
            const isChecked = (data.features || []).includes(feature.id);
            return (
              <button
                key={feature.id}
                type="button"
                onClick={() => toggleFeature(feature.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  isChecked
                    ? 'border-[#2D6A4F] bg-[#E8F2EC]/50 text-[#1E4D2B] font-semibold'
                    : 'border-[#E5DDD1] bg-white text-[#5C4D41] hover:bg-[#FAF7F2]'
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#8C7E72] shrink-0" />
                )}
                <span className="text-xs sm:text-sm">{feature.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Reference Link */}
      <div className="space-y-2">
        <label htmlFor="refUrl" className="block text-sm font-bold text-[#201A15]">
          Online Reference Link <span className="text-xs font-normal text-[#8C7E72]">(Optional Pinterest, Instagram, or Design URL)</span>
        </label>
        <div className="relative">
          <input
            id="refUrl"
            type="url"
            value={data.referenceUrl || ''}
            onChange={(e) => onChange({ referenceUrl: e.target.value })}
            placeholder="https://pinterest.com/pin/example-furniture-idea"
            className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
          />
          <LinkIcon className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.referenceUrl && (
          <p className="text-xs text-red-600">{errors.referenceUrl}</p>
        )}
      </div>

      {/* Step Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E5DDD1]">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl border border-[#E5DDD1] bg-white text-[#5C4D41] hover:bg-[#FAF7F2] font-semibold text-sm flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1E4D2B] font-bold text-sm flex items-center gap-2 shadow-xs hover-lift cursor-pointer transition-all focus-accessible"
        >
          <span>Continue to Photos & Site Visit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
