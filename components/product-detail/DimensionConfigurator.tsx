'use client';

import React, { useState } from 'react';
import { Ruler, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { ProductDimensions } from '../../types/api';

interface DimensionConfiguratorProps {
  dimensions?: ProductDimensions;
  defaultSummary?: string;
  onChangeCustomDimensions: (customString: string | null, isValid: boolean) => void;
}

export const DimensionConfigurator: React.FC<DimensionConfiguratorProps> = ({
  dimensions,
  defaultSummary = 'Standard dimensions configured by workshop',
  onChangeCustomDimensions,
}) => {
  const isCustomizable = dimensions?.customizable ?? false;
  const standard = dimensions?.standard;
  const limits = dimensions?.limits;

  const [mode, setMode] = useState<'standard' | 'custom'>('standard');
  const [width, setWidth] = useState<number>(standard?.widthInches || 72);
  const [height, setHeight] = useState<number>(standard?.heightInches || 42);
  const [depth, setDepth] = useState<number>(standard?.depthInches || 78);
  const [error, setError] = useState<string | null>(null);

  const inchesToCm = (inches: number) => Math.round(inches * 2.54);

  const validateAndEmit = (newW: number, newH: number, newD: number) => {
    if (!limits) {
      setError(null);
      onChangeCustomDimensions(`${newW}" W x ${newH}" H x ${newD}" D`, true);
      return;
    }

    let err: string | null = null;
    if (limits.minWidthInches && newW < limits.minWidthInches) {
      err = `Width cannot be less than ${limits.minWidthInches} inches for structural stability.`;
    } else if (limits.maxWidthInches && newW > limits.maxWidthInches) {
      err = `Width cannot exceed ${limits.maxWidthInches} inches for workshop transport.`;
    } else if (limits.minHeightInches && newH < limits.minHeightInches) {
      err = `Height cannot be less than ${limits.minHeightInches} inches.`;
    } else if (limits.maxHeightInches && newH > limits.maxHeightInches) {
      err = `Height cannot exceed ${limits.maxHeightInches} inches.`;
    } else if (limits.minDepthInches && newD < limits.minDepthInches) {
      err = `Depth/Length cannot be less than ${limits.minDepthInches} inches.`;
    } else if (limits.maxDepthInches && newD > limits.maxDepthInches) {
      err = `Depth/Length cannot exceed ${limits.maxDepthInches} inches.`;
    }

    setError(err);
    if (!err) {
      onChangeCustomDimensions(`${newW}" W x ${newH}" H x ${newD}" D`, true);
    } else {
      onChangeCustomDimensions(null, false);
    }
  };

  const handleModeChange = (newMode: 'standard' | 'custom') => {
    setMode(newMode);
    if (newMode === 'standard') {
      setError(null);
      onChangeCustomDimensions(null, true);
    } else {
      validateAndEmit(width, height, depth);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5DDD1] p-5 shadow-2xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#FAF3EB] text-[#6B3F23] flex items-center justify-center">
            <Ruler className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B3F23]">
              Dimensions & Sizing
            </h4>
            <p className="text-xs text-[#5C4D41]">
              {standard?.summary || defaultSummary}
            </p>
          </div>
        </div>

        {isCustomizable && (
          <span className="text-[11px] font-semibold bg-[#E8F2EC] text-[#1E4D2B] px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Made to Measure</span>
          </span>
        )}
      </div>

      {/* Mode Switcher if Customizable */}
      {isCustomizable && (
        <div className="flex rounded-xl bg-[#FAF7F2] p-1 border border-[#E5DDD1]">
          <button
            type="button"
            onClick={() => handleModeChange('standard')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'standard'
                ? 'bg-white text-[#201A15] shadow-xs'
                : 'text-[#8C7E72] hover:text-[#201A15]'
            }`}
          >
            Standard Specs
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('custom')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'custom'
                ? 'bg-white text-[#1E4D2B] shadow-xs'
                : 'text-[#8C7E72] hover:text-[#201A15]'
            }`}
          >
            Customize Dimensions
          </button>
        </div>
      )}

      {/* Standard Display */}
      {mode === 'standard' && standard && (
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE8DC]">
            <span className="text-[10px] uppercase font-bold text-[#8C7E72] block">Width</span>
            <span className="text-xs font-bold text-[#201A15] block">
              {standard.widthInches}&quot; ({inchesToCm(standard.widthInches)} cm)
            </span>
          </div>
          <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE8DC]">
            <span className="text-[10px] uppercase font-bold text-[#8C7E72] block">Height</span>
            <span className="text-xs font-bold text-[#201A15] block">
              {standard.heightInches}&quot; ({inchesToCm(standard.heightInches)} cm)
            </span>
          </div>
          <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EFE8DC]">
            <span className="text-[10px] uppercase font-bold text-[#8C7E72] block">Depth/Length</span>
            <span className="text-xs font-bold text-[#201A15] block">
              {standard.depthInches}&quot; ({inchesToCm(standard.depthInches)} cm)
            </span>
          </div>
        </div>
      )}

      {/* Custom Dimension Form */}
      {mode === 'custom' && (
        <div className="space-y-3 pt-1">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label htmlFor="dim-custom-width" className="text-[10px] uppercase font-bold text-[#8C7E72] block mb-1">
                Width (in)
              </label>
              <input
                id="dim-custom-width"
                type="number"
                value={width}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWidth(val);
                  validateAndEmit(val, height, depth);
                }}
                className="w-full bg-[#FAF7F2] border border-[#E5DDD1] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#201A15] text-center focus:border-[#2D6A4F] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="dim-custom-height" className="text-[10px] uppercase font-bold text-[#8C7E72] block mb-1">
                Height (in)
              </label>
              <input
                id="dim-custom-height"
                type="number"
                value={height}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setHeight(val);
                  validateAndEmit(width, val, depth);
                }}
                className="w-full bg-[#FAF7F2] border border-[#E5DDD1] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#201A15] text-center focus:border-[#2D6A4F] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="dim-custom-depth" className="text-[10px] uppercase font-bold text-[#8C7E72] block mb-1">
                Depth (in)
              </label>
              <input
                id="dim-custom-depth"
                type="number"
                value={depth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDepth(val);
                  validateAndEmit(width, height, val);
                }}
                className="w-full bg-[#FAF7F2] border border-[#E5DDD1] rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#201A15] text-center focus:border-[#2D6A4F] focus:outline-none"
              />
            </div>
          </div>

          {error ? (
            <div className="flex items-start gap-1.5 text-xs text-[#C14436] bg-[#FDF2F0] p-2 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-[#1E4D2B] bg-[#E8F2EC] p-2 rounded-xl">
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Valid dimension specs within workshop joinery parameters.</span>
            </div>
          )}

          {limits && (
            <p className="text-[11px] text-[#8C7E72] italic">
              Configured boundaries: Width ({limits.minWidthInches}&quot;–{limits.maxWidthInches}&quot;), Height ({limits.minHeightInches}&quot;–{limits.maxHeightInches}&quot;), Depth ({limits.minDepthInches}&quot;–{limits.maxDepthInches}&quot;).
            </p>
          )}
        </div>
      )}
    </div>
  );
};
