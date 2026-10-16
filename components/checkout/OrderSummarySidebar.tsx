'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, Tag, Info } from 'lucide-react';
import { CartItem, CheckoutValidationResponse } from '@/types/api';

interface OrderSummarySidebarProps {
  items: CartItem[];
  validation: CheckoutValidationResponse | null;
  isLoading?: boolean;
}

export const OrderSummarySidebar: React.FC<OrderSummarySidebarProps> = ({
  items,
  validation,
  isLoading,
}) => {
  const subtotalPaise = validation?.subtotalPaise ?? items.reduce((sum, i) => sum + i.lineTotalPaise, 0);
  const deliveryPaise = validation?.deliveryPaise ?? 0;
  const installationPaise = validation?.installationPaise ?? 0;
  const taxPaise = validation?.taxPaise ?? 0;
  const discountPaise = validation?.discountPaise ?? 0;
  const totalPaise = validation?.totalPaise ?? Math.max(0, subtotalPaise + deliveryPaise + installationPaise + taxPaise - discountPaise);

  return (
    <aside
      aria-label="Order Summary & Cost Breakdown"
      className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm sticky top-24"
    >
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-5">
        <h2 className="text-lg font-bold text-stone-900 tracking-tight">Order Summary</h2>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800 hover:text-amber-900 hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Edit Cart
        </Link>
      </div>

      {/* Item List Snapshot */}
      <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-stone-500 italic">No products in checkout.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex gap-3 text-sm">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-stone-900 text-xs sm:text-sm line-clamp-1">
                  {item.name}
                </h3>
                <div className="text-[11px] text-stone-500 mt-0.5 space-y-0.5">
                  {item.selectedWoodSpecies && <p>Wood: {item.selectedWoodSpecies}</p>}
                  {item.selectedFinish && <p>Finish: {item.selectedFinish}</p>}
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="font-bold text-stone-900 text-xs sm:text-sm block">
                  ₹{(item.lineTotalPaise / 100).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-500">
                  ₹{(item.pricePaise / 100).toLocaleString('en-IN')} each
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Authoritative Cost Breakdown */}
      <div className="space-y-2.5 pt-4 border-t border-stone-200 text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Subtotal</span>
          <span className="font-semibold text-stone-900">
            ₹{(subtotalPaise / 100).toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex justify-between text-stone-600">
          <span className="flex items-center gap-1.5">
            Local Delivery
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
              Free
            </span>
          </span>
          <span className="font-semibold text-emerald-700">₹0</span>
        </div>

        {installationPaise > 0 ? (
          <div className="flex justify-between text-stone-600">
            <span>Carpenter Assembly</span>
            <span className="font-semibold text-stone-900">
              ₹{(installationPaise / 100).toLocaleString('en-IN')}
            </span>
          </div>
        ) : (
          <div className="flex justify-between text-stone-600">
            <span className="flex items-center gap-1.5">
              Workshop Assembly
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                Included
              </span>
            </span>
            <span className="font-semibold text-emerald-700">₹0</span>
          </div>
        )}

        <div className="flex justify-between text-stone-600">
          <span>Taxes (GST Included)</span>
          <span className="font-semibold text-emerald-700">₹0</span>
        </div>

        {discountPaise > 0 && (
          <div className="flex justify-between text-emerald-700 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              Promotional Discount
            </span>
            <span>-₹{(discountPaise / 100).toLocaleString('en-IN')}</span>
          </div>
        )}

        {/* Total */}
        <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
          <div>
            <span className="text-base font-bold text-stone-900 block">Total Due</span>
            <span className="text-[11px] text-stone-500 font-normal">
              Final verified price (INR)
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-emerald-800 tracking-tight">
              ₹{(totalPaise / 100).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Disclaimers & Security */}
      <div className="mt-6 pt-4 border-t border-stone-200 text-xs text-stone-500 space-y-2.5">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p>
            <strong>Authoritative Pricing:</strong> Calculated securely on our server using integer paise. No hidden fees or inflated checkout surcharges.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p>
            An order is confirmed only after workshop verification. Stock and dispatch schedule are finalized directly with you.
          </p>
        </div>
      </div>
    </aside>
  );
};
