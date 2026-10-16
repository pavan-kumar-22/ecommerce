'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Truck,
  Layers,
  Wrench,
  Clock,
} from 'lucide-react';
import { PublicProduct, OrderingStep } from '../../types/api';

interface ProductTabsProps {
  product: PublicProduct;
  orderingSteps: OrderingStep[];
}

type TabKey = 'description' | 'specifications' | 'inclusions' | 'ordering';

export const ProductTabs: React.FC<ProductTabsProps> = ({
  product,
  orderingSteps,
}) => {
  const [activeTab, setActiveTab] = useState<TabKey>('description');

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: 'description',
      label: 'Description & Wood Provenance',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      key: 'specifications',
      label: 'Specifications',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      key: 'inclusions',
      label: 'What is Included',
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      key: 'ordering',
      label: 'How Ordering Works',
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-[#E5DDD1] p-6 sm:p-8 shadow-xs">
      {/* 1. Accessible Tab Bar */}
      <div
        className="flex items-center gap-2 border-b border-[#E5DDD1] pb-px overflow-x-auto no-scrollbar"
        role="tablist"
        aria-label="Product detailed information tabs"
      >
        {tabs.map((tab) => {
          const isSelected = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 focus-accessible ${
                isSelected
                  ? 'border-[#1E4D2B] text-[#1E4D2B]'
                  : 'border-transparent text-[#5C4D41] hover:text-[#201A15] hover:border-[#DDD4C4]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Tab Contents */}
      <div className="pt-6">
        {/* A. Description & Provenance */}
        {activeTab === 'description' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h3 className="text-base font-bold text-[#201A15] mb-2">
                Craftsmanship & Wood Selection
              </h3>
              <p className="text-sm text-[#5C4D41] leading-relaxed">
                {product.fullDescription || product.shortDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B3F23]">
                  <Wrench className="w-4 h-4" />
                  <span>Joinery Integrity</span>
                </div>
                <p className="text-xs text-[#5C4D41] leading-relaxed">
                  Precision mortise-and-tenon joints secured with waterproof D3 wood adhesives.
                  Never assembled using weak brad nails or flimsy staples.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EFE8DC] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#6B3F23]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Moisture & Termite Shield</span>
                </div>
                <p className="text-xs text-[#5C4D41] leading-relaxed">
                  Timber seasoned to 10–12% equilibrium moisture content to prevent warping under
                  Andhra Pradesh&apos;s humid Krishna delta summers and monsoons.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* B. Specifications */}
        {activeTab === 'specifications' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-[#201A15] mb-3">
              Technical Specifications
            </h3>

            <div className="divide-y divide-[#E5DDD1] text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-[#8C7E72]">Product Identifier / SKU</span>
                <span className="font-bold text-[#201A15]">{product.sku || 'VC-CUSTOM'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-[#8C7E72]">Primary Timber</span>
                <span className="font-bold text-[#201A15]">
                  {product.woodSpecies?.join(', ') || 'Solid Seasoned Teak'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-[#8C7E72]">Dimensions</span>
                <span className="font-bold text-[#201A15]">
                  {product.dimensionsSummary || 'Configured to Order'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-[#8C7E72]">Surface Polish & Treatment</span>
                <span className="font-bold text-[#201A15]">{product.finishType || 'Natural Teak Melamine'}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-[#8C7E72]">Customisable</span>
                <span className="font-bold text-[#1E4D2B]">
                  {product.isCustomizable ? 'Yes — Made to your room dimensions' : 'Standard catalog size'}
                </span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="font-semibold text-[#8C7E72]">Workshop Lead Time</span>
                <span className="font-bold text-[#201A15]">
                  {product.leadTimeWeeks ? `${product.leadTimeWeeks} weeks from advance` : '3–4 weeks'}
                </span>
              </div>
              {product.hardwareSpecs && product.hardwareSpecs.length > 0 && (
                <div className="py-2.5">
                  <span className="font-semibold text-[#8C7E72] block mb-1.5">Hardware & Fittings</span>
                  <ul className="list-disc list-inside space-y-1 text-[#5C4D41]">
                    {product.hardwareSpecs.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* C. Inclusions & Exclusions */}
        {activeTab === 'inclusions' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#1E4D2B]" />
                  <span>What is Included</span>
                </h4>
                <ul className="space-y-2 text-xs text-[#5C4D41]">
                  {product.inclusions && product.inclusions.length > 0 ? (
                    product.inclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1E4D2B] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1E4D2B] shrink-0 mt-0.5" />
                        <span>Solid timber structural carcass and joinery</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1E4D2B] shrink-0 mt-0.5" />
                        <span>White-glove delivery and assembly in Vuyyuru/Vijayawada</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Exclusions */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#C14436] mb-3 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-[#C14436]" />
                  <span>What is Not Included</span>
                </h4>
                <ul className="space-y-2 text-xs text-[#5C4D41]">
                  {product.exclusions && product.exclusions.length > 0 ? (
                    product.exclusions.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-[#C14436] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-[#C14436] shrink-0 mt-0.5" />
                        <span>Mattress, soft bedding, or decorative furnishings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="w-3.5 h-3.5 text-[#C14436] shrink-0 mt-0.5" />
                        <span>Civil masonry work or electrical rewiring</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            {/* Delivery Scope Notice */}
            <div className="p-4 rounded-2xl bg-[#E8F2EC]/50 border border-[#1E4D2B]/20 flex items-start gap-3">
              <Truck className="w-5 h-5 text-[#1E4D2B] shrink-0 mt-0.5" />
              <div className="text-xs">
                <strong className="text-[#1E4D2B] block mb-0.5">Service & Delivery Scope</strong>
                <p className="text-[#5C4D41] leading-relaxed">
                  {product.deliveryNotice ||
                    'Complimentary delivery, room placement, and leveling included across Vuyyuru, Vijayawada, and Guntur. Regional transport across Krishna/NTR districts scheduled per customer convenience.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* D. How Ordering Works */}
        {activeTab === 'ordering' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <h3 className="text-base font-bold text-[#201A15] mb-2">
              Vuyyuru Carpentry Milestone Workflow
            </h3>
            <p className="text-xs text-[#5C4D41] mb-6">
              To protect both our customers and our artisan workshop, all bespoke woodwork follows
              our structured 4-step agreement.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {orderingSteps.map((s) => (
                <div
                  key={s.step}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E5DDD1] space-y-2 relative"
                >
                  <span className="w-6 h-6 rounded-full bg-[#1E4D2B] text-white text-xs font-bold flex items-center justify-center">
                    {s.step}
                  </span>
                  <h4 className="text-xs font-bold text-[#201A15] leading-snug">{s.title}</h4>
                  <p className="text-[11px] text-[#5C4D41] leading-relaxed">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
