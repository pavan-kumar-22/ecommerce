'use client';

import React, { useState } from 'react';
import {
  Send,
  Upload,
  X,
  ShieldCheck,
  Calendar,
  Clock,
  MapPin,
  AlertCircle,
  FileText,
  Lock,
  Phone,
  MessageSquare,
  Mail,
  Sparkles,
} from 'lucide-react';
import {
  PublicService,
  GeneralEnquiryPayload,
  EnquiryUrgency,
  EnquirySiteVisitOption,
  EnquiryContactMethod,
  PreferredVisitTimeWindow,
} from '@/types/api';

interface ContactFormProps {
  services: PublicService[];
  initialServiceId?: string;
  onSubmit: (payload: GeneralEnquiryPayload) => Promise<void>;
  isSubmitting: boolean;
  serverError: string | null;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  services,
  initialServiceId = '',
  onSubmit,
  isSubmitting,
  serverError,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState(initialServiceId);
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [urgency, setUrgency] = useState<EnquiryUrgency>('flexible');

  // Site Visit State
  const [siteVisit, setSiteVisit] = useState<EnquirySiteVisitOption>('advise_me');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeWindow, setPreferredTimeWindow] = useState<PreferredVisitTimeWindow>('morning');
  const [fullAddress, setFullAddress] = useState('');

  // Contact Method & Consent
  const [contactMethod, setContactMethod] = useState<EnquiryContactMethod>('phone');
  const [consentContact, setConsentContact] = useState(true);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  // Photo Uploads State
  const [photos, setPhotos] = useState<
    Array<{ id: string; url: string; filename: string; sizeBytes: number }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Client Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Minimum allowed date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      errs.name = 'Please enter your full name (minimum 2 characters).';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const normalizedPhone =
      cleanPhone.length === 12 && cleanPhone.startsWith('91')
        ? cleanPhone.slice(2)
        : cleanPhone.length === 11 && cleanPhone.startsWith('0')
        ? cleanPhone.slice(1)
        : cleanPhone;

    if (!/^[6-9]\d{9}$/.test(normalizedPhone)) {
      errs.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        errs.email = 'Please enter a valid email address or leave it empty.';
      }
    }

    if (!serviceId) {
      errs.serviceId = 'Please select a carpentry service.';
    }

    if (!description.trim() || description.trim().length < 10) {
      errs.description = 'Please describe what you need (minimum 10 characters).';
    } else if (description.trim().length > 1000) {
      errs.description = 'Description cannot exceed 1000 characters.';
    }

    if (!area.trim() || area.trim().length < 2) {
      errs.area = 'Please enter your town or locality (e.g. Vuyyuru, Benz Circle).';
    }

    if (siteVisit === 'yes') {
      if (!fullAddress.trim() || fullAddress.trim().length < 5) {
        errs.fullAddress = 'Please provide your street address or landmark for the site visit.';
      }
    }

    if (!consentContact) {
      errs.consent = 'You must consent to Vuyyuru Carpentry contacting you regarding this inquiry.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: GeneralEnquiryPayload = {
      serviceId,
      description: description.trim(),
      urgency,
      location: {
        area: area.trim(),
        fullAddress: siteVisit === 'yes' ? fullAddress.trim() : undefined,
      },
      siteVisit: {
        requested: siteVisit,
        preferredDate: siteVisit === 'yes' && preferredDate ? preferredDate : null,
        preferredTimeWindow: siteVisit === 'yes' ? preferredTimeWindow : null,
      },
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        preferredContactMethod: contactMethod,
      },
      consent: {
        contactForThisEnquiry: consentContact,
        marketingOptIn,
      },
      referencePhotos: photos,
    };

    await onSubmit(payload);
  };

  // Safe file upload handler
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (photos.length + files.length > 5) {
      setUploadError('Maximum 5 reference photos can be uploaded.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }

    try {
      const res = await fetch('/api/public/enquiries/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload photo.');
      }

      setPhotos((prev) => [...prev, ...data.data]);
    } catch (err: any) {
      setUploadError(err.message || 'Photo upload failed. Please try again or skip.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white rounded-3xl border border-[#E5DDD1] p-6 sm:p-10 shadow-xs space-y-8"
      aria-label="Carpentry Enquiry & Site-Visit Request Form"
    >
      {/* Server Error Alert */}
      {serverError && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800 text-xs sm:text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">Submission Error</span>
            <span>{serverError}</span>
          </div>
        </div>
      )}

      {/* 1. Contact Details Section */}
      <section aria-labelledby="section-contact-heading" className="space-y-4">
        <h2
          id="section-contact-heading"
          className="font-serif text-lg sm:text-xl font-bold text-[#201A15] pb-2 border-b border-[#F0EAE1]"
        >
          1. Your Contact Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Name Field */}
          <div>
            <label
              htmlFor="customer-name"
              className="block text-xs font-bold text-[#3E2312] mb-1.5"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="customer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ramesh Varma"
              maxLength={100}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#201A15] bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B] ${
                errors.name ? 'border-red-500 bg-red-50/40' : 'border-[#D9CFC4]'
              }`}
              aria-required="true"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.name}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <label
              htmlFor="customer-phone"
              className="block text-xs font-bold text-[#3E2312] mb-1.5"
            >
              Indian Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6B5E55]">
                +91
              </span>
              <input
                type="tel"
                id="customer-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98765 43210"
                maxLength={14}
                className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-sm text-[#201A15] bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B] ${
                  errors.phone ? 'border-red-500 bg-red-50/40' : 'border-[#D9CFC4]'
                }`}
                aria-required="true"
                aria-invalid={errors.phone ? 'true' : 'false'}
              />
            </div>
            {errors.phone ? (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.phone}</p>
            ) : (
              <p className="mt-1 text-[11px] text-[#6B5E55]">
                We will call or WhatsApp you to discuss your project requirements.
              </p>
            )}
          </div>

          {/* Email Field (Optional) */}
          <div className="sm:col-span-2">
            <label
              htmlFor="customer-email"
              className="block text-xs font-bold text-[#3E2312] mb-1.5"
            >
              Email Address <span className="text-[#8C7A6B] font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              id="customer-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ramesh@example.com"
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#201A15] bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B] ${
                errors.email ? 'border-red-500 bg-red-50/40' : 'border-[#D9CFC4]'
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
            )}
          </div>
        </div>
      </section>

      {/* 2. Service & Requirements Section */}
      <section aria-labelledby="section-service-heading" className="space-y-4">
        <h2
          id="section-service-heading"
          className="font-serif text-lg sm:text-xl font-bold text-[#201A15] pb-2 border-b border-[#F0EAE1]"
        >
          2. Carpentry Service & Work Scope
        </h2>

        {/* Service Dropdown */}
        <div>
          <label
            htmlFor="service-select"
            className="block text-xs font-bold text-[#3E2312] mb-1.5"
          >
            Service Needed <span className="text-red-500">*</span>
          </label>
          <select
            id="service-select"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#201A15] bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B] ${
              errors.serviceId ? 'border-red-500 bg-red-50/40' : 'border-[#D9CFC4]'
            }`}
            aria-required="true"
            aria-invalid={errors.serviceId ? 'true' : 'false'}
          >
            <option value="">-- Select an active carpentry service --</option>
            {services.map((srv) => (
              <option key={srv.id} value={srv.slug}>
                {srv.name} (
                {srv.pricingMode === 'inspection_required'
                  ? 'Inspection & Quote'
                  : srv.pricingMode === 'indicative'
                  ? 'Indicative Estimate'
                  : 'Fixed Price'}
                )
              </option>
            ))}
          </select>
          {errors.serviceId && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.serviceId}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="enquiry-description"
              className="block text-xs font-bold text-[#3E2312]"
            >
              Describe the Work Needed <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-[#8C7A6B]">
              {description.length}/1000 characters
            </span>
          </div>
          <textarea
            id="enquiry-description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please describe the damage, room dimensions, timber preference (e.g. Teak, Marine Ply), or specific requirements..."
            maxLength={1000}
            className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#201A15] bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B] ${
              errors.description ? 'border-red-500 bg-red-50/40' : 'border-[#D9CFC4]'
            }`}
            aria-required="true"
            aria-invalid={errors.description ? 'true' : 'false'}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Locality & Urgency Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Locality */}
          <div>
            <label
              htmlFor="enquiry-area"
              className="block text-xs font-bold text-[#3E2312] mb-1.5"
            >
              Town / Locality <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="enquiry-area"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="e.g. Vuyyuru Town, Benz Circle Vijayawada"
              maxLength={120}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#201A15] bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B] ${
                errors.area ? 'border-red-500 bg-red-50/40' : 'border-[#D9CFC4]'
              }`}
              aria-required="true"
              aria-invalid={errors.area ? 'true' : 'false'}
            />
            {errors.area ? (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.area}</p>
            ) : (
              <p className="mt-1 text-[11px] text-[#6B5E55]">
                We serve Vuyyuru town & mandal first, and nearby areas based on feasibility.
              </p>
            )}
          </div>

          {/* Urgency */}
          <div>
            <label
              htmlFor="enquiry-urgency"
              className="block text-xs font-bold text-[#3E2312] mb-1.5"
            >
              Urgency / Timeline
            </label>
            <select
              id="enquiry-urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as EnquiryUrgency)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] text-sm text-[#201A15] bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B]"
            >
              <option value="flexible">Flexible / Standard Workshop Queue</option>
              <option value="within_2_weeks">Within Next 2 Weeks</option>
              <option value="urgent_48h">Urgent (Within 48h · Capacity permitting)</option>
            </select>
            {urgency === 'urgent_48h' && (
              <p className="mt-1 text-[11px] text-[#D97706] font-medium flex items-center gap-1">
                <span>⚠️ Note: Urgent repairs depend on active carpenter availability.</span>
              </p>
            )}
          </div>
        </div>

        {/* Optional Reference Photos Upload */}
        <div>
          <label className="block text-xs font-bold text-[#3E2312] mb-1.5">
            Reference Photos <span className="text-[#8C7A6B] font-normal">(Optional · Max 5 photos · 5 MB each)</span>
          </label>

          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="photo-upload-input"
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#1E4D2B] bg-[#F0FDF4] hover:bg-[#DCFCE7] text-[#1E4D2B] text-xs font-bold cursor-pointer transition-colors ${
                isUploading || photos.length >= 5 ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Add Photos / Door Snap'}</span>
              <input
                id="photo-upload-input"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoUpload}
                disabled={isUploading || photos.length >= 5}
                className="sr-only"
              />
            </label>

            {photos.length > 0 && (
              <span className="text-xs text-[#5C4D41]">
                {photos.length} {photos.length === 1 ? 'photo' : 'photos'} attached
              </span>
            )}
          </div>

          {uploadError && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">{uploadError}</p>
          )}

          {/* Photo Previews */}
          {photos.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2.5">
              {photos.map((p) => (
                <div
                  key={p.id}
                  className="relative group bg-[#FAF7F2] border border-[#E5DDD1] rounded-lg px-2.5 py-1.5 flex items-center gap-2 text-xs text-[#201A15]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span className="truncate max-w-[120px]">{p.filename}</span>
                  <button
                    type="button"
                    onClick={() => removePhoto(p.id)}
                    className="text-[#8C7A6B] hover:text-red-600 p-0.5 rounded-xs"
                    aria-label={`Remove photo ${p.filename}`}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Site Visit Preference Section */}
      <section aria-labelledby="section-visit-heading" className="space-y-4">
        <h2
          id="section-visit-heading"
          className="font-serif text-lg sm:text-xl font-bold text-[#201A15] pb-2 border-b border-[#F0EAE1]"
        >
          3. Site Visit & Measurement Preference
        </h2>

        {/* Radio Option */}
        <fieldset className="space-y-2">
          <legend className="block text-xs font-bold text-[#3E2312] mb-2">
            Would you like an in-person carpenter site visit? <span className="text-red-500">*</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'yes', label: 'Yes, request a site visit', hint: 'For measurements & inspection' },
              { id: 'no', label: 'No, advise remotely first', hint: 'Quotation via photos/dimensions' },
              { id: 'advise_me', label: 'Advise me on feasibility', hint: 'Review scope and recommend' },
            ].map((opt) => (
              <label
                key={opt.id}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                  siteVisit === opt.id
                    ? 'border-[#1E4D2B] bg-[#F0FDF4] text-[#1E4D2B] ring-1 ring-[#1E4D2B]'
                    : 'border-[#E5DDD1] bg-[#FAF7F2] text-[#5C4D41] hover:bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="siteVisit"
                    value={opt.id}
                    checked={siteVisit === opt.id}
                    onChange={() => setSiteVisit(opt.id as EnquirySiteVisitOption)}
                    className="accent-[#1E4D2B]"
                  />
                  <span className="font-bold text-xs sm:text-sm text-[#201A15]">{opt.label}</span>
                </div>
                <span className="text-[11px] text-[#6B5E55] mt-1 pl-5">{opt.hint}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Conditional Fields if siteVisit === 'yes' */}
        {siteVisit === 'yes' && (
          <div className="p-4 sm:p-5 bg-[#FAF7F2] rounded-2xl border border-[#E5DDD1] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Preferred Date */}
              <div>
                <label
                  htmlFor="preferred-date"
                  className="block text-xs font-bold text-[#3E2312] mb-1.5 flex items-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>Preferred Visit Date</span>
                </label>
                <input
                  type="date"
                  id="preferred-date"
                  min={minDateString}
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] text-sm text-[#201A15] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B]"
                />
              </div>

              {/* Preferred Time Window */}
              <div>
                <label
                  htmlFor="preferred-time"
                  className="block text-xs font-bold text-[#3E2312] mb-1.5 flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5 text-[#1E4D2B]" />
                  <span>Preferred Time Window</span>
                </label>
                <select
                  id="preferred-time"
                  value={preferredTimeWindow}
                  onChange={(e) => setPreferredTimeWindow(e.target.value as PreferredVisitTimeWindow)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#D9CFC4] text-sm text-[#201A15] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B]"
                >
                  <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
                  <option value="afternoon">Afternoon (12:00 PM – 4:00 PM)</option>
                  <option value="evening">Evening (4:00 PM – 7:00 PM)</option>
                </select>
              </div>
            </div>

            {/* Address Field */}
            <div>
              <label
                htmlFor="full-address"
                className="block text-xs font-bold text-[#3E2312] mb-1.5 flex items-center gap-1"
              >
                <MapPin className="w-3.5 h-3.5 text-[#1E4D2B]" />
                <span>Full Street Address / Landmark for Site Visit <span className="text-red-500">*</span></span>
              </label>
              <textarea
                id="full-address"
                rows={2}
                value={fullAddress}
                onChange={(e) => setFullAddress(e.target.value)}
                placeholder="House/Plot No., Street Name, Landmark..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#201A15] bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1E4D2B] ${
                  errors.fullAddress ? 'border-red-500 bg-red-50/40' : 'border-[#D9CFC4]'
                }`}
                aria-required="true"
                aria-invalid={errors.fullAddress ? 'true' : 'false'}
              />
              {errors.fullAddress && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.fullAddress}</p>
              )}
              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#6B5E55]">
                <Lock className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>Your address is protected as private data and never shared publicly.</span>
              </div>
            </div>

            {/* Booking Notice */}
            <p className="text-[11px] text-[#6B5E55] bg-white p-3 rounded-xl border border-[#E5DDD1] leading-relaxed">
              <strong>Notice:</strong> Submitting a date preference does not represent a confirmed appointment. The workshop will contact you to verify capacity and travel feasibility.
            </p>
          </div>
        )}
      </section>

      {/* 4. Preferred Contact Method & Consent */}
      <section aria-labelledby="section-method-heading" className="space-y-4">
        <h2
          id="section-method-heading"
          className="font-serif text-lg sm:text-xl font-bold text-[#201A15] pb-2 border-b border-[#F0EAE1]"
        >
          4. Preferred Contact Channel & Consent
        </h2>

        {/* Contact Method Radios */}
        <fieldset>
          <legend className="block text-xs font-bold text-[#3E2312] mb-2">
            How should we reach you? <span className="text-red-500">*</span>
          </legend>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'phone', label: 'Phone Call', icon: Phone },
              { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
              { id: 'email', label: 'Email', icon: Mail },
            ].map((method) => {
              const Icon = method.icon;
              return (
                <label
                  key={method.id}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                    contactMethod === method.id
                      ? 'border-[#1E4D2B] bg-[#1E4D2B] text-white shadow-xs'
                      : 'border-[#D9CFC4] bg-[#FAF7F2] text-[#5C4D41] hover:bg-[#EFE8DC]'
                  }`}
                >
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method.id}
                    checked={contactMethod === method.id}
                    onChange={() => setContactMethod(method.id as EnquiryContactMethod)}
                    className="sr-only"
                  />
                  <Icon className="w-3.5 h-3.5" />
                  <span>{method.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Consent Checkboxes */}
        <div className="space-y-3 pt-2">
          {/* Required Contact Consent */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-[#4A3E36]">
            <input
              type="checkbox"
              id="consent-checkbox"
              checked={consentContact}
              onChange={(e) => setConsentContact(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#D9CFC4] text-[#1E4D2B] focus:ring-[#1E4D2B] accent-[#1E4D2B]"
              aria-required="true"
            />
            <span>
              I consent to Vuyyuru Carpentry reviewing my scope and contacting me regarding this carpentry request. <span className="text-red-500">*</span>
            </span>
          </label>
          {errors.consent && (
            <p className="text-xs text-red-600 font-medium pl-6">{errors.consent}</p>
          )}

          {/* Optional Marketing Opt-In (Separate and unchecked by default) */}
          <label className="flex items-start gap-2.5 cursor-pointer text-xs sm:text-sm text-[#6B5E55]">
            <input
              type="checkbox"
              id="marketing-optin"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-[#D9CFC4] text-[#1E4D2B] focus:ring-[#1E4D2B] accent-[#1E4D2B]"
            />
            <span>
              (Optional) Keep me informed of seasonal timber availability, holiday schedules, and workshop updates.
            </span>
          </label>
        </div>
      </section>

      {/* Submission Button */}
      <div className="pt-4 border-t border-[#F0EAE1] flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-[#6B5E55]">
          Submissions are tracked with an authoritative reference number.
        </p>

        <button
          type="submit"
          id="submit-enquiry-btn"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1E4D2B] hover:bg-[#2D6A4F] text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50 disabled:pointer-events-none focus-accessible"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Submitting Enquiry...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Enquiry</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
