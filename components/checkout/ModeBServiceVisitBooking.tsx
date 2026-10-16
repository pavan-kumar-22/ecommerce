'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  User,
  Phone,
  Mail,
  MapPin,
  Wrench,
  CheckCircle2,
  AlertCircle,
  FileText,
  Clock,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { PublicService, SiteVisitRequestRecord } from '@/types/api';
import { submitSiteVisitBooking } from '@/lib/api-client';

interface ModeBServiceVisitBookingProps {
  initialServiceSlug?: string;
  servicesList: PublicService[];
}

export const ModeBServiceVisitBooking: React.FC<ModeBServiceVisitBookingProps> = ({
  initialServiceSlug,
  servicesList,
}) => {
  const [serviceId, setServiceId] = useState(initialServiceSlug || (servicesList[0]?.slug || 'door-window-repairs'));
  const [workDescription, setWorkDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [area, setArea] = useState('Vuyyuru Town');
  const [fullAddress, setFullAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeWindow, setPreferredTimeWindow] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [referencePhotosSummary, setReferencePhotosSummary] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRecord, setSubmittedRecord] = useState<SiteVisitRequestRecord | null>(null);

  // Set min date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  // Set default preferred date to tomorrow if empty
  useEffect(() => {
    if (!preferredDate) {
      setPreferredDate(minDateStr);
    }
  }, [minDateStr, preferredDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!consentAccepted) {
      setErrorMessage('Please accept consent for our carpenters to contact you regarding this visit.');
      return;
    }

    if (workDescription.trim().length < 5) {
      setErrorMessage('Please provide a brief description of the repair or project (minimum 5 characters).');
      return;
    }

    setIsLoading(true);

    try {
      const record = await submitSiteVisitBooking({
        serviceId,
        workDescription,
        customerName,
        customerPhone,
        customerEmail: customerEmail.trim() || undefined,
        area,
        fullAddress: fullAddress.trim() || undefined,
        preferredDate,
        preferredTimeWindow,
        referencePhotosSummary: referencePhotosSummary.trim() || undefined,
        consentAccepted,
      });

      setSubmittedRecord(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit site visit request. Please check inputs and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success view
  if (submittedRecord) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4 border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 mb-2">
            Site Visit Request Submitted
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            Consultation Request Received
          </h2>
          <p className="text-stone-600 text-sm mt-2 max-w-lg mx-auto">
            Your tracking reference is{' '}
            <strong className="text-stone-900 font-mono text-base font-bold bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              {submittedRecord.reference}
            </strong>
          </p>

          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-sm font-semibold">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Status: Pending Confirmation</span>
          </div>

          <p className="text-xs text-stone-500 mt-3 max-w-md mx-auto leading-relaxed">
            Our workshop team will review the travel schedule and call{' '}
            <strong>{submittedRecord.customer.phone}</strong> to confirm the exact artisan visit time.
          </p>
        </div>

        {/* Request Details Breakdown */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5 text-sm">
          <h3 className="font-bold text-stone-900 border-b border-stone-200 pb-3">
            Requested Appointment Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 uppercase font-semibold block mb-0.5">Service</span>
              <p className="font-semibold text-stone-800">{submittedRecord.serviceName}</p>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-semibold block mb-0.5">Locality</span>
              <p className="font-semibold text-stone-800">{submittedRecord.location.area}</p>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-semibold block mb-0.5">Preferred Date</span>
              <p className="font-semibold text-stone-800">{submittedRecord.schedulePreference.preferredDate}</p>
            </div>
            <div>
              <span className="text-stone-400 uppercase font-semibold block mb-0.5">Time Window</span>
              <p className="font-semibold text-stone-800 capitalize">
                {submittedRecord.schedulePreference.preferredTimeWindow} Window
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <span className="text-stone-400 text-xs uppercase font-semibold block mb-1">Scope / Work Description</span>
            <p className="text-stone-700 bg-stone-50 p-3 rounded-lg border border-stone-200 text-xs">
              {submittedRecord.workDescription}
            </p>
          </div>

          {/* Legal / Policy Distinction */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900 space-y-1">
            <p className="font-bold">Important Distinction Notice:</p>
            <p>
              A site visit request is a scheduling enquiry, not a fixed-price order or an approved quotation. A written quotation will be prepared after physical inspection.
            </p>
          </div>
        </div>

        {/* Return buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-800 text-emerald-50 font-semibold hover:bg-emerald-900 transition-colors shadow-sm"
          >
            <span>Explore All Carpentry Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            type="button"
            onClick={() => {
              setSubmittedRecord(null);
              setWorkDescription('');
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-stone-100 text-stone-800 font-semibold hover:bg-stone-200 transition-colors border border-stone-300"
          >
            <span>Book Another Site Visit</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-sm">
      <div className="flex items-center gap-3 pb-5 border-b border-stone-200 mb-6">
        <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
          <CalendarClock className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            Request an On-Site Carpentry Visit
          </h2>
          <p className="text-xs text-stone-500">
            For home repairs, door alignments, modular kitchen measurements, and custom built-in furniture.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div
          role="alert"
          className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Submission Incomplete</p>
            <p className="mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Service Category Selection */}
        <div>
          <label htmlFor="visit-service" className="block text-sm font-semibold text-stone-900 mb-1.5">
            Service Required <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Wrench className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              id="visit-service"
              required
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              {servicesList.length === 0 ? (
                <option value="general-carpentry">General Carpentry & Inspection</option>
              ) : (
                servicesList.map((svc) => (
                  <option key={svc.id} value={svc.slug}>
                    {svc.name}
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {/* Work Description */}
        <div>
          <label htmlFor="visit-workDescription" className="block text-sm font-semibold text-stone-900 mb-1.5">
            Describe the Carpentry or Repair Needed <span className="text-red-500">*</span>
          </label>
          <textarea
            id="visit-workDescription"
            required
            rows={3}
            placeholder="e.g. Main teak entrance door scraping bottom floor; need alignment, hinges tightened, and fresh polish touch-up..."
            value={workDescription}
            onChange={(e) => setWorkDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
          <p className="text-xs text-stone-500 mt-1">
            Provide enough detail so our carpenters can bring the right tools and replacement joinery hardware.
          </p>
        </div>

        {/* Customer Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="visit-customerName" className="block text-sm font-semibold text-stone-900 mb-1.5">
              Your Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="visit-customerName"
                required
                placeholder="e.g. S. Ramakrishna"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="visit-customerPhone" className="block text-sm font-semibold text-stone-900 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Phone className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="tel"
                id="visit-customerPhone"
                required
                placeholder="10-digit number (e.g. 98480 12345)"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          </div>
        </div>

        {/* Area / Locality & Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="visit-area" className="block text-sm font-semibold text-stone-900 mb-1.5">
              Area / Locality in Krishna District <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-5 h-5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="visit-area"
                required
                placeholder="e.g. Vuyyuru Town, Mantada, Kankipadu"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
            </div>
          </div>

          <div>
            <label htmlFor="visit-fullAddress" className="block text-sm font-semibold text-stone-900 mb-1.5">
              House / Door / Street Address <span className="text-stone-400 text-xs font-normal">(For site visit)</span>
            </label>
            <input
              type="text"
              id="visit-fullAddress"
              placeholder="e.g. D.No 2-45, Gandhi Nagar"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>
        </div>

        {/* Schedule Preferences */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="visit-preferredDate" className="block text-sm font-semibold text-stone-900 mb-1.5">
              Preferred Visit Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="visit-preferredDate"
              required
              min={minDateStr}
              value={preferredDate}
              onChange={(e) => setPreferredDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          <div>
            <label htmlFor="visit-preferredTimeWindow" className="block text-sm font-semibold text-stone-900 mb-1.5">
              Preferred Time Window
            </label>
            <select
              id="visit-preferredTimeWindow"
              value={preferredTimeWindow}
              onChange={(e) => setPreferredTimeWindow(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
              <option value="afternoon">Afternoon (1:00 PM – 4:00 PM)</option>
              <option value="evening">Evening (4:00 PM – 7:00 PM)</option>
            </select>
          </div>
        </div>

        {/* Optional Reference Photos / Dimensions Summary */}
        <div>
          <label htmlFor="visit-referencePhotos" className="block text-sm font-semibold text-stone-900 mb-1.5">
            Reference Photos / Additional Details <span className="text-stone-400 text-xs font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            id="visit-referencePhotos"
            placeholder="e.g. 2 doors need fitting; photos can be sent to workshop WhatsApp after enquiry"
            value={referencePhotosSummary}
            onChange={(e) => setReferencePhotosSummary(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900"
          />
        </div>

        {/* Transparent Site Visit Fee Policy */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Honest Workshop Site-Visit Policy</span>
          </div>
          <p>
            Preliminary site inspection in Vuyyuru town & mandal is <strong>complimentary (₹0)</strong>. For outer mandals in Krishna or Guntur districts, a nominal travel reimbursement (₹200–₹300) applies and is <strong>credited against your final carpentry quotation</strong> upon approval.
          </p>
          <p className="text-[11px] text-emerald-800 italic">
            No fee is charged upfront online.
          </p>
        </div>

        {/* Consent Checkbox */}
        <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              className="mt-0.5 h-4 w-4 text-emerald-800 rounded border-stone-300 focus:ring-emerald-800"
            />
            <span className="text-xs text-stone-700 leading-relaxed">
              I consent to Vuyyuru Carpentry artisans contacting me via phone or WhatsApp regarding this site visit request. I understand this request is a scheduling preference and pending confirmation until verified.
            </span>
          </label>
        </div>

        {/* Submit Action */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isLoading || !consentAccepted}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-emerald-800 text-emerald-50 font-bold hover:bg-emerald-900 transition-all shadow-md disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Submitting Request...</span>
            ) : (
              <>
                <CalendarClock className="w-5 h-5" />
                <span>Submit Site Visit Request (Pending Confirmation)</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
