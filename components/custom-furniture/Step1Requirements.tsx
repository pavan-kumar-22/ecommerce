'use client';

import React from 'react';
import {
  Bed,
  DoorClosed,
  Tv,
  Utensils,
  BookOpen,
  LayoutGrid,
  Sparkles,
  Briefcase,
  Store,
  Plus,
  HelpCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { FurnitureType, ProjectNature, UrgencyLevel } from '@/types/api';

export interface Step1FormData {
  furnitureType: FurnitureType | '';
  customFurnitureType?: string;
  room?: string;
  description: string;
  quantity: number;
  projectNature?: ProjectNature;
  urgency?: UrgencyLevel;
}

interface Step1Props {
  data: Step1FormData;
  onChange: (updates: Partial<Step1FormData>) => void;
  onNext: () => void;
  errors: Record<string, string>;
}

const FURNITURE_TYPES: { id: FurnitureType; label: string; icon: any; popular?: boolean }[] = [
  { id: 'bed', label: 'Bed / King Cot', icon: Bed, popular: true },
  { id: 'wardrobe', label: 'Wardrobe / Cupboard', icon: LayoutGrid, popular: true },
  { id: 'table', label: 'Dining / Study Table', icon: Utensils, popular: true },
  { id: 'pooja_unit', label: 'Pooja Mandir / Unit', icon: Sparkles, popular: true },
  { id: 'door', label: 'Main Door / Frame', icon: DoorClosed },
  { id: 'tv_unit', label: 'TV Wall Unit', icon: Tv },
  { id: 'kitchen_cabinet', label: 'Modular Kitchen Cabinets', icon: Utensils },
  { id: 'shelf', label: 'Bookshelf / Display Rack', icon: BookOpen },
  { id: 'partition', label: 'Divider / Fluted Partition', icon: LayoutGrid },
  { id: 'commercial_fixture', label: 'Office / Shop Counter', icon: Store },
  { id: 'other', label: 'Other Custom Joinery', icon: Plus },
];

const ROOM_OPTIONS = [
  'Master Bedroom',
  'Living Room',
  'Dining Hall',
  'Pooja Room',
  'Kitchen & Pantry',
  'Home Office / Study',
  'Commercial / Shop Space',
  'Balcony / Verandah',
  'Other / Whole House',
];

export const Step1Requirements: React.FC<Step1Props> = ({
  data,
  onChange,
  onNext,
  errors,
}) => {
  const charCount = (data.description || '').length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-1">
          <span>Step 1 of 4</span>
          <span>·</span>
          <span>Project Requirements</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#201A15]">
          What do you want to make?
        </h2>
        <p className="text-sm text-[#5C4D41] mt-1 max-w-2xl">
          Select the furniture category, intended room, and tell our master carpenters what you envision. We craft every piece from seasoned timber at our Vuyyuru workshop.
        </p>
      </div>

      {/* 1. Furniture Type Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-[#201A15]">
            Furniture Type <span className="text-red-500">*</span>
          </label>
          <span className="text-xs text-[#8C7E72]">Select the primary piece</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {FURNITURE_TYPES.map((type) => {
            const isSelected = data.furnitureType === type.id;
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange({ furnitureType: type.id })}
                className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#8B5A2B] bg-[#F9F5EF] text-[#3E2312] ring-2 ring-[#8B5A2B]/30 shadow-xs'
                    : 'border-[#E5DDD1] bg-white text-[#5C4D41] hover:border-[#8B5A2B]/40 hover:bg-[#FAF7F2]'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                    isSelected ? 'bg-[#8B5A2B] text-white' : 'bg-[#F3ECE2] text-[#6B3F23]'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs sm:text-sm font-semibold leading-tight line-clamp-2">
                  {type.label}
                </span>
                {type.popular && (
                  <span className="mt-1 text-[10px] uppercase font-bold text-[#2D6A4F] bg-[#E8F2EC] px-1.5 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {errors.furnitureType && (
          <p className="text-xs text-red-600 flex items-center gap-1 mt-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.furnitureType}
          </p>
        )}

        {/* Conditional "Other" input */}
        {data.furnitureType === 'other' && (
          <div className="p-4 rounded-xl bg-[#F9F5EF] border border-[#E5DDD1] space-y-2 mt-3 animate-fadeIn">
            <label htmlFor="customFurnitureType" className="block text-xs font-bold text-[#3E2312]">
              Specify Custom Furniture Item <span className="text-red-500">*</span>
            </label>
            <input
              id="customFurnitureType"
              type="text"
              value={data.customFurnitureType || ''}
              onChange={(e) => onChange({ customFurnitureType: e.target.value })}
              placeholder="e.g. Diwan bed with storage, Shoe console cabinet, Study nook"
              maxLength={80}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
            />
            {errors.customFurnitureType && (
              <p className="text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.customFurnitureType}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 2. Room or Location */}
      <div className="space-y-2">
        <label htmlFor="roomSelect" className="block text-sm font-bold text-[#201A15]">
          Room or Location <span className="text-xs font-normal text-[#8C7E72]">(Optional)</span>
        </label>
        <select
          id="roomSelect"
          value={data.room || ''}
          onChange={(e) => onChange({ room: e.target.value })}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
        >
          <option value="">Select room or location</option>
          {ROOM_OPTIONS.map((room) => (
            <option key={room} value={room}>
              {room}
            </option>
          ))}
        </select>
      </div>

      {/* 3. Project Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="projectDescription" className="block text-sm font-bold text-[#201A15]">
            Project Description & Requirements <span className="text-red-500">*</span>
          </label>
          <span
            className={`text-xs ${
              charCount > 1400
                ? 'text-amber-600 font-bold'
                : charCount < 10
                ? 'text-[#8C7E72]'
                : 'text-[#2D6A4F]'
            }`}
          >
            {charCount} / 1,500 chars (min 10)
          </span>
        </div>
        <textarea
          id="projectDescription"
          rows={4}
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Explain the intended purpose, desired features (e.g. soft-close drawers, hydraulic cot lift, fluted glass, brass inlay), and any space constraints or wall obstacles..."
          maxLength={1500}
          className="w-full p-3.5 text-sm bg-white border border-[#E5DDD1] rounded-xl focus-accessible focus:border-[#8B5A2B] leading-relaxed"
        />
        {errors.description && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {errors.description}
          </p>
        )}
        <p className="text-xs text-[#8C7E72]">
          Tip: Mention if you have existing woodwork or wall paint you would like this piece to match.
        </p>
      </div>

      {/* 4. Number of Items Stepper */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#201A15]">
            Number of Items <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onChange({ quantity: Math.max(1, (data.quantity || 1) - 1) })}
              disabled={(data.quantity || 1) <= 1}
              className="w-10 h-10 rounded-lg border border-[#E5DDD1] bg-white hover:bg-[#FAF7F2] font-bold text-lg text-[#201A15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              min={1}
              max={20}
              value={data.quantity || 1}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val)) onChange({ quantity: Math.min(20, Math.max(1, val)) });
              }}
              className="w-20 text-center font-bold text-base py-2 border border-[#E5DDD1] rounded-lg bg-white focus-accessible"
            />
            <button
              type="button"
              onClick={() => onChange({ quantity: Math.min(20, (data.quantity || 1) + 1) })}
              disabled={(data.quantity || 1) >= 20}
              className="w-10 h-10 rounded-lg border border-[#E5DDD1] bg-white hover:bg-[#FAF7F2] font-bold text-lg text-[#201A15] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            >
              +
            </button>
            <span className="text-xs text-[#5C4D41]">Max 20 units per request</span>
          </div>
          {errors.quantity && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {errors.quantity}
            </p>
          )}
        </div>

        {/* 5. Nature of Project */}
        <div className="space-y-2">
          <label className="block text-sm font-bold text-[#201A15]">
            Project Nature <span className="text-xs font-normal text-[#8C7E72]">(Optional)</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'new', label: 'New Build' },
              { id: 'replacement', label: 'Replacement' },
              { id: 'repair_mod', label: 'Modification' },
            ].map((nature) => (
              <button
                key={nature.id}
                type="button"
                onClick={() => onChange({ projectNature: nature.id as ProjectNature })}
                className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                  data.projectNature === nature.id
                    ? 'border-[#8B5A2B] bg-[#F9F5EF] text-[#3E2312] font-bold ring-1 ring-[#8B5A2B]'
                    : 'border-[#E5DDD1] bg-white text-[#5C4D41] hover:bg-[#FAF7F2]'
                }`}
              >
                {nature.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 6. Urgency */}
      <div className="space-y-2">
        <label htmlFor="urgencySelect" className="block text-sm font-bold text-[#201A15]">
          Project Timeframe / Urgency <span className="text-xs font-normal text-[#8C7E72]">(Optional)</span>
        </label>
        <select
          id="urgencySelect"
          value={data.urgency || 'flexible'}
          onChange={(e) => onChange({ urgency: e.target.value as UrgencyLevel })}
          className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
        >
          <option value="flexible">Flexible — Planning ahead (within 2–3 months)</option>
          <option value="within_month">Target timeframe — Needed within 4–6 weeks</option>
          <option value="one_to_two_months">Intermediate — 1 to 2 months</option>
          <option value="urgent">Urgent enquiry (1–2 weeks, depending on workshop queue)</option>
        </select>
        <p className="text-xs text-[#8C7E72]">
          Note: Seasoned hardwood joinery requires adequate curing and finish-curing time for lasting strength.
        </p>
      </div>

      {/* Continue Action */}
      <div className="flex justify-end pt-4 border-t border-[#E5DDD1]">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-[#2D6A4F] text-white hover:bg-[#1E4D2B] font-bold text-sm flex items-center gap-2 shadow-xs hover-lift cursor-pointer transition-all focus-accessible"
        >
          <span>Continue to Dimensions</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
