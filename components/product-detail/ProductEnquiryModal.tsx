'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import { PublicProduct, ProductEnquiryResponse } from '../../types/api';
import { submitProductEnquiry } from '../../lib/api-client';
import { FormField } from '../ui/FormField';

interface ProductEnquiryModalProps {
  product: PublicProduct;
  isOpen: boolean;
  onClose: () => void;
  selectedWood: string;
  selectedFinish: string;
  selectedDimensions?: string | null;
  quantity: number;
}

export const ProductEnquiryModal: React.FC<ProductEnquiryModalProps> = ({
  product,
  isOpen,
  onClose,
  selectedWood,
  selectedFinish,
  selectedDimensions,
  quantity,
}) => {
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [deliveryTown, setDeliveryTown] = useState<string>('Vuyyuru');
  const [message, setMessage] = useState<string>(
    `Please provide a quotation for ${product.name} in ${selectedWood} with ${selectedFinish}.`
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [response, setResponse] = useState<ProductEnquiryResponse | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.customerName = 'Please enter your full name (minimum 2 characters)';
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 12) {
      errs.customerPhone = 'Please enter a valid 10-digit Indian phone number';
    }

    if (message.length > 500) {
      errs.message = 'Message must not exceed 500 characters';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const res = await submitProductEnquiry({
        productId: product.id,
        productSlug: product.slug,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail.trim() || undefined,
        deliveryTown,
        requestedOptions: {
          woodSpecies: selectedWood,
          finish: selectedFinish,
          customDimensions: selectedDimensions || undefined,
        },
        quantity,
        message: message.trim(),
      });

      setResponse(res.data);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit enquiry. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappText = response
    ? encodeURIComponent(
      `Namaste Vuyyuru Carpentry, I submitted an enquiry for ${product.name} (Ref: ${response.enquiryId}). Options: ${selectedWood}, ${selectedFinish}, Qty: ${quantity}. Delivery to: ${deliveryTown}.`
    )
    : '';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-heading"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF7F2] rounded-3xl border border-[#E5DDD1] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#8C7E72] hover:text-[#201A15] hover:bg-white transition-colors focus-accessible"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success State */}
        {response ? (
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#E8F2EC] text-[#1E4D2B] flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1E4D2B] bg-[#E8F2EC] px-3 py-1 rounded-full inline-block mb-1.5">
                Reference ID: {response.enquiryId}
              </span>
              <h3 id="enquiry-modal-heading" className="text-xl font-bold text-[#201A15]">
                Enquiry Successfully Received
              </h3>
              <p className="text-xs text-[#5C4D41] mt-2 max-w-sm mx-auto leading-relaxed">
                {response.message}
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#E5DDD1] text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8C7E72]">Product:</span>
                <strong className="text-[#201A15]">{response.summary.productTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7E72]">Estimated Lead Time:</span>
                <span className="font-semibold text-[#1E4D2B]">{response.summary.estimatedLeadTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8C7E72]">Workshop Contact:</span>
                <span className="font-semibold text-[#201A15]">{response.summary.consultationContact}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
              <a
                href={`https://wa.me/918639731477?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#1EBE5D] transition-colors focus-accessible shadow-xs"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Now on WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-white border border-[#E5DDD1] text-xs font-semibold text-[#201A15] hover:bg-[#EFE8DC] transition-colors focus-accessible"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#1E4D2B] mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Custom Furniture Consultation</span>
              </div>
              <h2 id="enquiry-modal-heading" className="text-xl font-bold text-[#201A15]">
                Request Quotation: {product.name}
              </h2>
              <p className="text-xs text-[#5C4D41] mt-0.5">
                Our master carpenter will review your specifications and contact you with timber pricing.
              </p>
            </div>

            {/* Selected Options Summary Pill */}
            <div className="bg-white p-3 rounded-2xl border border-[#E5DDD1] text-xs flex flex-wrap gap-x-4 gap-y-1 text-[#5C4D41]">
              <span><strong>Wood:</strong> {selectedWood}</span>
              <span><strong>Finish:</strong> {selectedFinish}</span>
              <span><strong>Qty:</strong> {quantity}</span>
              {selectedDimensions && <span><strong>Custom Size:</strong> {selectedDimensions}</span>}
            </div>

            {errors.form && (
              <div className="p-3 rounded-xl bg-[#FDF2F0] border border-[#C14436]/20 text-xs text-[#C14436]">
                {errors.form}
              </div>
            )}

            <FormField id="enquiry-name" label="Your Full Name" required error={errors.customerName}>
              <input
                id="enquiry-name"
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Varma"
                className="w-full bg-white border border-[#E5DDD1] rounded-xl px-3.5 py-2 text-xs text-[#201A15] focus:border-[#2D6A4F] focus:outline-none"
              />
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormField
                id="enquiry-phone"
                label="Mobile Phone (10 digits)"
                required
                error={errors.customerPhone}
                hint="For WhatsApp / call"
              >
                <input
                  id="enquiry-phone"
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="e.g. 98765 43210"
                  className="w-full bg-white border border-[#E5DDD1] rounded-xl px-3.5 py-2 text-xs text-[#201A15] focus:border-[#2D6A4F] focus:outline-none"
                />
              </FormField>

              <FormField id="enquiry-town" label="Delivery Town / City" required>
                <select
                  id="enquiry-town"
                  value={deliveryTown}
                  onChange={(e) => setDeliveryTown(e.target.value)}
                  className="w-full bg-white border border-[#E5DDD1] rounded-xl px-3.5 py-2 text-xs text-[#201A15] focus:border-[#2D6A4F] focus:outline-none"
                >
                  <option value="Vuyyuru">Vuyyuru (Workshop Town)</option>
                  <option value="Vijayawada">Vijayawada</option>
                  <option value="Guntur">Guntur</option>
                  <option value="Tenali">Tenali</option>
                  <option value="Machilipatnam">Machilipatnam</option>
                  <option value="Gannavaram">Gannavaram</option>
                  <option value="Other AP District">Other Andhra Pradesh Location</option>
                </select>
              </FormField>
            </div>

            <FormField id="enquiry-email" label="Email Address (Optional)">
              <input
                id="enquiry-email"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. ramesh@example.com"
                className="w-full bg-white border border-[#E5DDD1] rounded-xl px-3.5 py-2 text-xs text-[#201A15] focus:border-[#2D6A4F] focus:outline-none"
              />
            </FormField>

            <FormField
              id="enquiry-message"
              label="Special Requirements / Notes"
              error={errors.message}
              hint="Max 500 characters"
            >
              <textarea
                id="enquiry-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                placeholder="Mention specific vastu requirements, bedroom measurements, or wood tone preferences."
                className="w-full bg-white border border-[#E5DDD1] rounded-xl p-3 text-xs text-[#201A15] focus:border-[#2D6A4F] focus:outline-none resize-none"
              />
            </FormField>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#E5DDD1] bg-white text-xs font-semibold text-[#5C4D41] hover:bg-[#EFE8DC] transition-colors focus-accessible"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1E4D2B] text-white text-xs font-semibold hover:bg-[#2D6A4F] transition-colors focus-accessible shadow-xs disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Custom Enquiry</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
