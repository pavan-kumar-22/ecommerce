'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  PackageCheck,
  CreditCard,
  Banknote,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  CartItem,
  CheckoutCustomerContact,
  CheckoutDeliveryAddress,
  CheckoutFulfilmentSelection,
  FulfilmentMethod,
  FulfilmentOption,
  PaymentMethod,
  OrderRecord,
  CheckoutValidationResponse,
} from '@/types/api';
import { CheckoutProgressBar, CheckoutStep } from './CheckoutProgressBar';
import { OrderSummarySidebar } from './OrderSummarySidebar';
import {
  getFulfilmentOptions,
  validateCheckoutCart,
  createOrder,
  createPaymentSession,
} from '@/lib/api-client';

interface ModeAFixedPriceCheckoutProps {
  initialItems: CartItem[];
  sessionId: string;
}

export const ModeAFixedPriceCheckout: React.FC<ModeAFixedPriceCheckoutProps> = ({
  initialItems,
  sessionId,
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState<CheckoutStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fulfilment options loaded from backend
  const [fulfilmentOptions, setFulfilmentOptions] = useState<FulfilmentOption[]>([]);

  // Step 1: Contact
  const [contact, setContact] = useState<CheckoutCustomerContact>({
    name: '',
    phone: '',
    email: '',
  });
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({});

  // Step 2: Fulfilment
  const [fulfilment, setFulfilment] = useState<CheckoutFulfilmentSelection>({
    method: 'local_delivery',
    address: {
      area: 'Vuyyuru Town',
      addressLine: '',
      landmark: '',
      pincode: '521165',
    },
    preferredSchedule: 'Weekday Morning (9 AM – 1 PM)',
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [orderNotes, setOrderNotes] = useState('');

  // Step 3: Payment & Terms
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_on_delivery');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  // Server revalidation state
  const [validation, setValidation] = useState<CheckoutValidationResponse | null>(null);

  // Step 4: Confirmed Order
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  // Load fulfilment options and perform initial server validation
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const options = await getFulfilmentOptions();
        if (isMounted) setFulfilmentOptions(options);

        const val = await validateCheckoutCart({
          guestSessionId: sessionId,
          fulfilmentMethod: fulfilment.method,
        });
        if (isMounted) setValidation(val);
      } catch (err: any) {
        if (isMounted) setErrorMessage(err.message || 'Failed to load checkout options.');
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadData();
    // Generate unique idempotency key for this checkout attempt
    setIdempotencyKey(`idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  // Phone validation helper
  const validatePhone = (raw: string): boolean => {
    const cleaned = raw.replace(/\D/g, '');
    return cleaned.length === 10 && /^[6-9]\d{9}$/.test(cleaned);
  };

  // Step 1 Submission
  const handleProceedToFulfilment = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!contact.name || contact.name.trim().length === 0) {
      errors.name = 'Please enter your full name.';
    }

    if (!contact.phone || !validatePhone(contact.phone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number (e.g. 98480 12345).';
    }

    if (contact.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
      errors.email = 'Please enter a valid email address.';
    }

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      return;
    }

    setContactErrors({});
    setCurrentStep(2);
    setMaxAccessibleStep((prev) => Math.max(prev, 2) as CheckoutStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 Submission
  const handleProceedToReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedOption = fulfilmentOptions.find((o) => o.id === fulfilment.method);
    const errors: Record<string, string> = {};

    if (selectedOption?.requiresAddress) {
      if (!fulfilment.address?.area || fulfilment.address.area.trim().length === 0) {
        errors.area = 'Please enter your delivery town or locality.';
      }
      if (!fulfilment.address?.addressLine || fulfilment.address.addressLine.trim().length === 0) {
        errors.addressLine = 'Please enter your street name and house / building address.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setAddressErrors(errors);
      return;
    }

    setAddressErrors({});
    setIsLoading(true);

    try {
      // Revalidate with server using chosen fulfilment method
      const val = await validateCheckoutCart({
        guestSessionId: sessionId,
        fulfilmentMethod: fulfilment.method,
      });
      setValidation(val);

      if (!val.canCheckout) {
        setErrorMessage(
          val.changes.length > 0
            ? val.changes.join(' ')
            : 'Certain products are not eligible for direct fixed-price checkout.'
        );
        setIsLoading(false);
        return;
      }

      setErrorMessage(null);
      setCurrentStep(3);
      setMaxAccessibleStep((prev) => Math.max(prev, 3) as CheckoutStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Server revalidation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Place Order Submission (Idempotent)
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setErrorMessage('You must review and accept the workshop crafting and delivery terms.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const order = await createOrder({
        idempotencyKey,
        guestSessionId: sessionId,
        contact,
        fulfilment,
        paymentMethod,
        orderNotes,
        termsAccepted,
      });

      // If advance online payment was chosen, initiate session
      if (paymentMethod === 'online_upi_advance') {
        await createPaymentSession({
          orderId: order.id,
          orderToken: order.orderToken,
          paymentMethod: 'online_upi_advance',
        });
      }

      setConfirmedOrder(order);
      setCurrentStep(4);
      setMaxAccessibleStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to place order. Please review your cart and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if cart is empty before ordering
  if ((!validation?.items || validation.items.length === 0) && currentStep !== 4) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Your Cart is Currently Empty</h2>
        <p className="text-stone-600 text-sm mb-6 leading-relaxed">
          Fixed-price checkout requires at least one eligible solid wood product in your cart. Add handcrafted furniture from our workshop catalogue to proceed.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-800 text-amber-50 font-semibold hover:bg-amber-900 transition-colors shadow-sm"
          >
            <span>Browse Ready Furniture</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/custom-furniture"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-100 text-stone-800 font-semibold hover:bg-stone-200 transition-colors border border-stone-300"
          >
            <span>Request Custom Furniture</span>
          </Link>
        </div>
      </div>
    );
  }

  // Step 4: Confirmed Order View
  if (currentStep === 4 && confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Success Card */}
        <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            Order Successfully Placed
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Thank you, {confirmedOrder.contact.name}!
          </h2>
          <p className="text-stone-600 text-sm mt-2 max-w-lg mx-auto">
            Your fixed-price order reference is{' '}
            <strong className="text-stone-900 font-mono text-base font-bold bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {confirmedOrder.orderReference}
            </strong>
            . Our head artisan will review timber stock and confirm your workshop schedule.
          </p>

          {/* Status Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-left max-w-lg mx-auto">
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold block">
                Order Status
              </span>
              <span className="text-sm font-bold text-amber-900 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-4 h-4 text-amber-700" />
                Pending Workshop Review
              </span>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-semibold block">
                Payment Status
              </span>
              <span className="text-sm font-bold text-stone-900 flex items-center gap-1.5 mt-0.5">
                <Banknote className="w-4 h-4 text-emerald-700" />
                {confirmedOrder.paymentStatus === 'unpaid'
                  ? 'Unpaid (Due on Delivery)'
                  : 'Payment Pending'}
              </span>
            </div>
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-3">
            Handcrafted Items & Specifications
          </h3>
          <div className="space-y-4">
            {confirmedOrder.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-start text-sm pb-3 border-b border-stone-100 last:border-b-0">
                <div>
                  <h4 className="font-semibold text-stone-900">{item.productName}</h4>
                  <div className="text-xs text-stone-500 space-y-0.5 mt-0.5">
                    {item.selectedWoodSpecies && <p>Wood: {item.selectedWoodSpecies}</p>}
                    {item.selectedFinish && <p>Finish: {item.selectedFinish}</p>}
                    <p>Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900">
                    ₹{(item.lineTotalPaise / 100).toLocaleString('en-IN')}
                  </span>
                  <span className="block text-xs text-stone-500">
                    ₹{(item.unitPricePaise / 100).toLocaleString('en-IN')} unit
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing summary */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">
                ₹{(confirmedOrder.pricing.subtotalPaise / 100).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Delivery & Assembly</span>
              <span className="font-semibold text-emerald-700">Complimentary (₹0)</span>
            </div>
            {confirmedOrder.pricing.discountPaise > 0 && (
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Promotional Discount</span>
                <span>-₹{(confirmedOrder.pricing.discountPaise / 100).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Final Total</span>
              <span className="text-xl text-emerald-800">
                ₹{(confirmedOrder.pricing.totalPaise / 100).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Fulfilment & Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-200 text-xs text-stone-600">
            <div>
              <span className="font-bold text-stone-900 block mb-1">Fulfilment Method</span>
              <p>{confirmedOrder.fulfilment.methodName}</p>
              {confirmedOrder.fulfilment.address && (
                <p className="mt-1">
                  {confirmedOrder.fulfilment.address.addressLine}, {confirmedOrder.fulfilment.address.area}
                </p>
              )}
            </div>
            <div>
              <span className="font-bold text-stone-900 block mb-1">Customer Contact</span>
              <p>{confirmedOrder.contact.name}</p>
              <p>{confirmedOrder.contact.phone}</p>
              {confirmedOrder.contact.email && <p>{confirmedOrder.contact.email}</p>}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-800 text-amber-50 font-semibold hover:bg-amber-900 transition-colors shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/918639731477?text=Namaste%2C%20I%20have%20an%20order%20query%20for%20reference%20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-100 text-stone-800 font-semibold hover:bg-stone-200 transition-colors border border-stone-300"
          >
            <span>Contact Workshop on WhatsApp</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Multi-step Form */}
      <div className="lg:col-span-8 space-y-6">
        <CheckoutProgressBar
          currentStep={currentStep}
          maxAccessibleStep={maxAccessibleStep}
          onStepClick={(step) => setCurrentStep(step)}
        />

        {/* Error Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3 shadow-xs"
          >
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Checkout Action Required</p>
              <p className="mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* Step 1: Contact Details */}
        {/* ========================================================= */}
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-200 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">Customer Contact Details</h2>
                <p className="text-xs text-stone-500">
                  We use your contact to coordinate timber grain selection, crafting updates, and delivery.
                </p>
              </div>
            </div>

            <form onSubmit={handleProceedToFulfilment} className="space-y-5">
              <div>
                <label htmlFor="customer-name" className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    id="customer-name"
                    required
                    placeholder="e.g. K. Venkata Rao"
                    value={contact.name}
                    onChange={(e) => setContact({ ...contact, name: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all ${
                      contactErrors.name ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                    }`}
                  />
                </div>
                {contactErrors.name && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{contactErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Mobile Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    id="customer-phone"
                    required
                    placeholder="10-digit number (e.g. 98480 12345)"
                    value={contact.phone}
                    onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all ${
                      contactErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-stone-300'
                    }`}
                  />
                </div>
                {contactErrors.phone ? (
                  <p className="text-xs text-red-600 mt-1 font-medium">{contactErrors.phone}</p>
                ) : (
                  <p className="text-xs text-stone-500 mt-1">
                    Normalized server-side to Indian standard format (+91).
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="customer-email" className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Email Address <span className="text-stone-400 text-xs font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    id="customer-email"
                    placeholder="name@example.com"
                    value={contact.email || ''}
                    onChange={(e) => setContact({ ...contact, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800 transition-all"
                  />
                </div>
                {contactErrors.email && (
                  <p className="text-xs text-red-600 mt-1 font-medium">{contactErrors.email}</p>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-800 text-amber-50 font-semibold hover:bg-amber-900 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Continue to Fulfilment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* Step 2: Fulfilment Details */}
        {/* ========================================================= */}
        {currentStep === 2 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-200 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">Fulfilment & Delivery Method</h2>
                <p className="text-xs text-stone-500">
                  Select how you would like to receive your handcrafted furniture.
                </p>
              </div>
            </div>

            <form onSubmit={handleProceedToReview} className="space-y-6">
              {/* Method Selection Radio Group */}
              <div className="space-y-3" role="radiogroup" aria-label="Fulfilment Options">
                {fulfilmentOptions.map((opt) => {
                  const isSelected = fulfilment.method === opt.id;
                  return (
                    <label
                      key={opt.id}
                      className={`block p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-800 bg-amber-50/40 ring-2 ring-amber-100'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="fulfilmentMethod"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() => setFulfilment({ ...fulfilment, method: opt.id })}
                          className="mt-1 h-4 w-4 text-amber-800 focus:ring-amber-800 border-stone-300"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-stone-900 text-sm sm:text-base">
                              {opt.name}
                            </span>
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                              {opt.pricePaise === 0 ? 'Complimentary' : `₹${opt.pricePaise / 100}`}
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1">{opt.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                              {opt.estimatedDays}
                            </span>
                            <span>•</span>
                            <span>{opt.notes}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Conditional Delivery Address */}
              {fulfilmentOptions.find((o) => o.id === fulfilment.method)?.requiresAddress && (
                <div className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span>Delivery Address (Vuyyuru & Krishna District)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="delivery-area" className="block text-xs font-semibold text-stone-700 mb-1">
                        Locality / Town <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="delivery-area"
                        required
                        placeholder="e.g. Vuyyuru Town, Kankipadu, Mantada"
                        value={fulfilment.address?.area || ''}
                        onChange={(e) =>
                          setFulfilment({
                            ...fulfilment,
                            address: { ...fulfilment.address!, area: e.target.value },
                          })
                        }
                        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-stone-900 bg-white ${
                          addressErrors.area ? 'border-red-400' : 'border-stone-300'
                        }`}
                      />
                      {addressErrors.area && (
                        <p className="text-xs text-red-600 mt-1">{addressErrors.area}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="delivery-pincode" className="block text-xs font-semibold text-stone-700 mb-1">
                        Pincode <span className="text-stone-400 text-[10px]">(Vuyyuru 521165)</span>
                      </label>
                      <input
                        type="text"
                        id="delivery-pincode"
                        placeholder="521165"
                        value={fulfilment.address?.pincode || ''}
                        onChange={(e) =>
                          setFulfilment({
                            ...fulfilment,
                            address: { ...fulfilment.address!, pincode: e.target.value },
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="delivery-addressLine" className="block text-xs font-semibold text-stone-700 mb-1">
                      Street Address / House / Flat No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="delivery-addressLine"
                      required
                      placeholder="e.g. D.No 4-122, Main Bazar Road"
                      value={fulfilment.address?.addressLine || ''}
                      onChange={(e) =>
                        setFulfilment({
                          ...fulfilment,
                          address: { ...fulfilment.address!, addressLine: e.target.value },
                        })
                      }
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-stone-900 bg-white ${
                        addressErrors.addressLine ? 'border-red-400' : 'border-stone-300'
                      }`}
                    />
                    {addressErrors.addressLine && (
                      <p className="text-xs text-red-600 mt-1">{addressErrors.addressLine}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="delivery-landmark" className="block text-xs font-semibold text-stone-700 mb-1">
                      Landmark <span className="text-stone-400 text-[10px]">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="delivery-landmark"
                      placeholder="e.g. Near RTC Bus Stand / Sri Rama Temple"
                      value={fulfilment.address?.landmark || ''}
                      onChange={(e) =>
                        setFulfilment({
                          ...fulfilment,
                          address: { ...fulfilment.address!, landmark: e.target.value },
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Delivery Schedule Request */}
              <div>
                <label htmlFor="preferred-schedule" className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Preferred Delivery Timing Preference
                </label>
                <select
                  id="preferred-schedule"
                  value={fulfilment.preferredSchedule}
                  onChange={(e) => setFulfilment({ ...fulfilment, preferredSchedule: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white"
                >
                  <option value="Weekday Morning (9 AM – 1 PM)">Weekday Morning (9 AM – 1 PM)</option>
                  <option value="Weekday Afternoon (2 PM – 6 PM)">Weekday Afternoon (2 PM – 6 PM)</option>
                  <option value="Weekend Slot (Saturday / Sunday by arrangement)">Weekend Slot (Saturday / Sunday)</option>
                </select>
                <p className="text-xs text-stone-500 mt-1">
                  Requested delivery windows are preferences; exact time is coordinated by our workshop lead before dispatch.
                </p>
              </div>

              {/* Order Notes */}
              <div>
                <label htmlFor="order-notes" className="block text-sm font-semibold text-stone-900 mb-1.5">
                  Special Delivery Instructions / Access Notes <span className="text-stone-400 text-xs font-normal">(Optional)</span>
                </label>
                <textarea
                  id="order-notes"
                  rows={2}
                  maxLength={300}
                  placeholder="e.g. Ground floor delivery, lift available, or narrow stairwell alert..."
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 resize-none"
                />
                <span className="text-[11px] text-stone-400 block text-right">
                  {300 - orderNotes.length} characters remaining · Non-binding request
                </span>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Contact</span>
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-800 text-amber-50 font-semibold hover:bg-amber-900 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <span>{isLoading ? 'Revalidating...' : 'Continue to Review & Pay'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* Step 3: Review & Payment Selection */}
        {/* ========================================================= */}
        {currentStep === 3 && (
          <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-stone-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-xl font-bold text-stone-900 tracking-tight">Review Order & Payment Method</h2>
                <p className="text-xs text-stone-500">
                  Verify contact, delivery destination, and payment terms before placing your order.
                </p>
              </div>
            </div>

            {/* Snapshot Verification of Previous Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">Contact</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-amber-800 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-medium text-stone-900">{contact.name}</p>
                <p className="text-stone-600">{contact.phone}</p>
                {contact.email && <p className="text-stone-500">{contact.email}</p>}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">Fulfilment</span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-amber-800 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-medium text-stone-900">
                  {fulfilmentOptions.find((o) => o.id === fulfilment.method)?.name}
                </p>
                {fulfilment.address && (
                  <p className="text-stone-600">
                    {fulfilment.address.addressLine}, {fulfilment.address.area}
                  </p>
                )}
                <p className="text-stone-500">{fulfilment.preferredSchedule}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-bold text-stone-900">
                Choose Payment Mode <span className="text-red-500">*</span>
              </label>

              {/* Option 1: Pay on Delivery */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'pay_on_delivery'
                    ? 'border-amber-800 bg-amber-50/40 ring-2 ring-amber-100'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="pay_on_delivery"
                  checked={paymentMethod === 'pay_on_delivery'}
                  onChange={() => setPaymentMethod('pay_on_delivery')}
                  className="mt-1 h-4 w-4 text-amber-800 focus:ring-amber-800"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold text-stone-900 text-sm">
                      Pay on Delivery / Workshop Inspection (Recommended)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Pay securely via Cash or UPI QR to our delivery artisans after physically inspecting timber joinery and finish at your home.
                  </p>
                </div>
              </label>

              {/* Option 2: Advance UPI / Netbanking */}
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === 'online_upi_advance'
                    ? 'border-amber-800 bg-amber-50/40 ring-2 ring-amber-100'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online_upi_advance"
                  checked={paymentMethod === 'online_upi_advance'}
                  onChange={() => setPaymentMethod('online_upi_advance')}
                  className="mt-1 h-4 w-4 text-amber-800 focus:ring-amber-800"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-700" />
                    <span className="font-bold text-stone-900 text-sm">
                      Advance Online Session (UPI / Netbanking)
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Initiate advance payment via verified banking gateway. Payment is recorded only upon server webhook confirmation.
                  </p>
                </div>
              </label>
            </div>

            {/* Terms Acknowledgement */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-amber-800 rounded border-stone-300 focus:ring-amber-800"
                />
                <span className="text-xs text-stone-700 leading-relaxed">
                  I acknowledge that my order is handcrafted by Vuyyuru Carpentry artisans. I agree that stock availability and dispatch schedule will be confirmed with me by phone, and that full payment is subject to physical inspection.
                </span>
              </label>
            </div>

            {/* Place Order CTA */}
            <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-600 hover:text-stone-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Fulfilment</span>
              </button>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isLoading || !termsAccepted}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-800 text-emerald-50 font-bold hover:bg-emerald-900 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span>Processing Idempotent Order...</span>
                ) : (
                  <>
                    <PackageCheck className="w-5 h-5" />
                    <span>Confirm & Place Fixed-Price Order</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Sticky Order Summary */}
      <div className="lg:col-span-4">
        <OrderSummarySidebar
          items={validation?.items || initialItems}
          validation={validation}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
