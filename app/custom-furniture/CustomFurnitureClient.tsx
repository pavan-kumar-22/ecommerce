'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Home, Shield, Sparkles, CheckCircle2, Clock } from 'lucide-react';

import { SiteHeader } from '@/components/SiteHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { MobileContactAction } from '@/components/MobileContactAction';

import { StepIndicator } from '@/components/custom-furniture/StepIndicator';
import { Step1Requirements, Step1FormData } from '@/components/custom-furniture/Step1Requirements';
import { Step2Dimensions, Step2FormData } from '@/components/custom-furniture/Step2Dimensions';
import { Step3SitePhotos, Step3FormData } from '@/components/custom-furniture/Step3SitePhotos';
import { Step4ContactConsent, Step4FormData } from '@/components/custom-furniture/Step4ContactConsent';
import { EnquiryConfirmation } from '@/components/custom-furniture/EnquiryConfirmation';

import {
  CustomFurnitureEnquiryPayload,
  CustomFurnitureEnquiryResponse,
  FurnitureType,
  SiteSettings,
  ServiceCategory,
} from '@/types/api';
import { submitCustomFurnitureEnquiry } from '@/lib/api-client';
import { verifiedSiteSettings, verifiedCategories } from '@/lib/public-data';

export function CustomFurnitureClient() {
  const searchParams = useSearchParams();

  // 1. Initial State Pre-fill from query params (e.g. ?type=wardrobe, ?project=slug, ?reference=title)
  const queryType = searchParams.get('type') as FurnitureType | null;
  const queryCategory = searchParams.get('category') || '';
  const queryRoom = searchParams.get('room') || '';
  const queryProject = searchParams.get('project') || '';
  const queryReference = searchParams.get('reference') || '';

  const resolveInitialType = (): FurnitureType | '' => {
    if (queryType) return queryType;
    if (queryCategory === 'doors') return 'door';
    if (queryCategory === 'wardrobes') return 'wardrobe';
    if (queryCategory === 'interiors') return 'pooja_unit';
    if (queryCategory === 'furniture') return 'table';
    return '';
  };

  const initialDescription =
    queryReference || queryProject
      ? `Inquiry for similar custom carpentry: "${queryReference || queryProject}". Please review requirements and advise on timber choices and quotation process.`
      : '';

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [maxCompletedStep, setMaxCompletedStep] = useState<number>(1);

  // Form Data State
  const [step1Data, setStep1Data] = useState<Step1FormData>({
    furnitureType: resolveInitialType(),
    customFurnitureType: '',
    room: queryRoom,
    description: initialDescription,
    quantity: 1,
    projectNature: 'new',
    urgency: 'flexible',
  });

  const [step2Data, setStep2Data] = useState<Step2FormData>({
    widthMm: undefined,
    heightMm: undefined,
    depthMm: undefined,
    confidence: 'approximate',
    materialPreference: 'not_sure',
    finishPreference: 'not_sure',
    colorPreference: '',
    features: ['drawers', 'shelves'],
    referenceUrl: queryProject ? `/projects/${queryProject}` : '',
  });

  const [step3Data, setStep3Data] = useState<Step3FormData>({
    area: '',
    visitRequested: 'advise_me',
    preferredDate: null,
    preferredTimeWindow: 'morning',
    accessNotes: '',
    referencePhotos: [],
  });

  const [step4Data, setStep4Data] = useState<Step4FormData>({
    name: '',
    phone: '',
    whatsappAvailable: true,
    email: '',
    preferredContactMethod: 'whatsapp',
    consent: false,
    marketingOptIn: false,
  });

  // Validation & Submission State
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});
  const [step3Errors, setStep3Errors] = useState<Record<string, string>>({});
  const [step4Errors, setStep4Errors] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionResponse, setSubmissionResponse] =
    useState<CustomFurnitureEnquiryResponse | null>(null);

  // Settings & Categories for header/footer
  const [settings] = useState<SiteSettings>(verifiedSiteSettings);
  const [categories] = useState<ServiceCategory[]>(verifiedCategories);

  // Scroll to top of wizard on step change
  useEffect(() => {
    window.scrollTo({ top: 120, behavior: 'smooth' });
  }, [currentStep]);

  // -------------------------------------------------------------
  // Validation Handlers
  // -------------------------------------------------------------
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!step1Data.furnitureType) {
      errors.furnitureType = 'Please select a furniture type.';
    }
    if (step1Data.furnitureType === 'other' && (!step1Data.customFurnitureType || !step1Data.customFurnitureType.trim())) {
      errors.customFurnitureType = 'Please specify what custom furniture you want made.';
    }
    const cleanDesc = (step1Data.description || '').trim();
    if (cleanDesc.length < 10) {
      errors.description = 'Please describe your custom furniture project (at least 10 characters).';
    } else if (cleanDesc.length > 1500) {
      errors.description = 'Description cannot exceed 1,500 characters.';
    }
    const qty = Number(step1Data.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) {
      errors.quantity = 'Number of items must be between 1 and 20.';
    }

    setStep1Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!step2Data.confidence) {
      errors.confidence = 'Please select dimension confidence.';
    }
    if (step2Data.widthMm !== undefined && step2Data.widthMm <= 0) {
      errors.dimensions = 'Width must be a positive number in millimetres.';
    }
    if (step2Data.heightMm !== undefined && step2Data.heightMm <= 0) {
      errors.dimensions = 'Height must be a positive number in millimetres.';
    }
    if (step2Data.depthMm !== undefined && step2Data.depthMm <= 0) {
      errors.dimensions = 'Depth must be a positive number in millimetres.';
    }
    if (step2Data.referenceUrl && step2Data.referenceUrl.trim()) {
      const url = step2Data.referenceUrl.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        errors.referenceUrl = 'Reference URL must begin with http:// or https://';
      }
    }

    setStep2Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};
    if (!step3Data.area || !step3Data.area.trim()) {
      errors.area = 'Please enter your locality / area in Andhra Pradesh.';
    }
    if (!step3Data.visitRequested) {
      errors.visitRequested = 'Please specify if an on-site survey is requested.';
    }
    if (
      (step3Data.visitRequested === 'yes' || step3Data.visitRequested === 'advise_me') &&
      step3Data.preferredDate
    ) {
      const selected = new Date(step3Data.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        errors.preferredDate = 'Preferred site visit date must be today or in the future.';
      }
    }

    setStep3Errors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errors: Record<string, string> = {};
    const cleanName = (step4Data.name || '').trim();
    if (cleanName.length < 2 || cleanName.length > 100) {
      errors.name = 'Please enter your full name (between 2 and 100 characters).';
    }
    const cleanPhone = (step4Data.phone || '').replace(/\D/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 12) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number.';
    }
    if (step4Data.email && step4Data.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(step4Data.email.trim())) {
        errors.email = 'Please enter a valid email address or leave blank.';
      }
    }
    if (!step4Data.consent) {
      errors.consent = 'You must consent to Vuyyuru Carpentry contacting you regarding this quotation request.';
    }

    setStep4Errors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------------------------------------
  // Step Navigation
  // -------------------------------------------------------------
  const handleStep1Next = () => {
    if (validateStep1()) {
      setCurrentStep(2);
      setMaxCompletedStep((prev) => Math.max(prev, 2));
    }
  };

  const handleStep2Next = () => {
    if (validateStep2()) {
      setCurrentStep(3);
      setMaxCompletedStep((prev) => Math.max(prev, 3));
    }
  };

  const handleStep3Next = () => {
    if (validateStep3()) {
      setCurrentStep(4);
      setMaxCompletedStep((prev) => Math.max(prev, 4));
    }
  };

  const handleStepClick = (step: number) => {
    // Only allow jumping back or to completed steps
    if (step < currentStep || step <= maxCompletedStep) {
      setCurrentStep(step);
    }
  };

  // -------------------------------------------------------------
  // Final Submission Handler
  // -------------------------------------------------------------
  const handleSubmit = async () => {
    // 1. Validate all steps
    const valid1 = validateStep1();
    const valid2 = validateStep2();
    const valid3 = validateStep3();
    const valid4 = validateStep4();

    if (!valid1) {
      setCurrentStep(1);
      return;
    }
    if (!valid2) {
      setCurrentStep(2);
      return;
    }
    if (!valid3) {
      setCurrentStep(3);
      return;
    }
    if (!valid4) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const payload: CustomFurnitureEnquiryPayload = {
      type: 'custom_furniture',
      requirements: {
        furnitureType: step1Data.furnitureType as FurnitureType,
        customFurnitureType: step1Data.customFurnitureType,
        room: step1Data.room,
        description: step1Data.description.trim(),
        quantity: step1Data.quantity,
        projectNature: step1Data.projectNature,
        urgency: step1Data.urgency,
        dimensions: {
          widthMm: step2Data.widthMm,
          heightMm: step2Data.heightMm,
          depthMm: step2Data.depthMm,
          confidence: step2Data.confidence,
        },
        materialPreference: step2Data.materialPreference,
        finishPreference: step2Data.finishPreference,
        colorPreference: step2Data.colorPreference,
        features: step2Data.features,
        referenceUrl: step2Data.referenceUrl?.trim() || undefined,
      },
      site: {
        area: step3Data.area.trim(),
        visitRequested: step3Data.visitRequested,
        preferredDate: step3Data.preferredDate || null,
        preferredTimeWindow: step3Data.preferredTimeWindow || null,
        accessNotes: step3Data.accessNotes?.trim() || undefined,
      },
      customer: {
        name: step4Data.name.trim(),
        phone: step4Data.phone.replace(/\D/g, ''),
        whatsappAvailable: step4Data.whatsappAvailable,
        email: step4Data.email?.trim() || undefined,
        preferredContactMethod: step4Data.preferredContactMethod,
      },
      consent: {
        contactForThisEnquiry: step4Data.consent,
        marketingOptIn: step4Data.marketingOptIn,
        privacyNoticeVersion: 'v2026.1',
      },
      referencePhotos: step3Data.referencePhotos,
    };

    try {
      const res = await submitCustomFurnitureEnquiry(payload);
      if (res.data) {
        setSubmissionResponse(res.data);
      } else {
        throw new Error('No confirmation received from server.');
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmitError(
        err.message ||
          'Failed to send your custom furniture request. Please check your network and retry.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSubmissionResponse(null);
    setCurrentStep(1);
    setMaxCompletedStep(1);
    setStep1Data({
      furnitureType: '',
      customFurnitureType: '',
      room: '',
      description: '',
      quantity: 1,
      projectNature: 'new',
      urgency: 'flexible',
    });
    setStep2Data({
      widthMm: undefined,
      heightMm: undefined,
      depthMm: undefined,
      confidence: 'approximate',
      materialPreference: 'not_sure',
      finishPreference: 'not_sure',
      colorPreference: '',
      features: ['drawers', 'shelves'],
      referenceUrl: '',
    });
    setStep3Data({
      area: '',
      visitRequested: 'advise_me',
      preferredDate: null,
      preferredTimeWindow: 'morning',
      accessNotes: '',
      referencePhotos: [],
    });
    setStep4Data({
      name: '',
      phone: '',
      whatsappAvailable: true,
      email: '',
      preferredContactMethod: 'whatsapp',
      consent: false,
      marketingOptIn: false,
    });
    setSubmitError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2]">
      {/* Site Header */}
      <SiteHeader settings={settings} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center text-xs text-[#5C4D41]">
          <Link href="/" className="hover:text-[#8B5A2B] flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 mx-1.5 text-[#8C7E72]" />
          <span className="font-semibold text-[#201A15]" aria-current="page">
            Custom Furniture Request
          </span>
        </nav>

        {/* Hero Title & Value Proposition */}
        {!submissionResponse && (
          <div className="mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F2EC] text-[#2D6A4F] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Solid Wood Joinery · Vuyyuru Workshop</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#201A15] tracking-tight">
              Custom Furniture Request
            </h1>
            <p className="text-sm sm:text-base text-[#5C4D41] max-w-2xl leading-relaxed">
              Describe your dream furniture piece in 4 guided steps. Our master carpenters will review your requirements, conduct a site survey if needed, and prepare a verified written quotation.
            </p>
          </div>
        )}

        {/* Wizard Card Container */}
        {submissionResponse ? (
          <div className="bg-white border border-[#E5DDD1] rounded-3xl p-6 sm:p-10 shadow-xs">
            <EnquiryConfirmation response={submissionResponse} onReset={handleReset} />
          </div>
        ) : (
          <div className="bg-white border border-[#E5DDD1] rounded-3xl p-5 sm:p-8 md:p-10 shadow-xs">
            {/* 4-Step Indicator */}
            <StepIndicator
              currentStep={currentStep}
              onStepClick={handleStepClick}
              maxCompletedStep={maxCompletedStep}
            />

            {/* Step 1: Requirements */}
            {currentStep === 1 && (
              <Step1Requirements
                data={step1Data}
                onChange={(updates) => setStep1Data((prev) => ({ ...prev, ...updates }))}
                onNext={handleStep1Next}
                errors={step1Errors}
              />
            )}

            {/* Step 2: Dimensions & Wood Preferences */}
            {currentStep === 2 && (
              <Step2Dimensions
                data={step2Data}
                onChange={(updates) => setStep2Data((prev) => ({ ...prev, ...updates }))}
                onNext={handleStep2Next}
                onBack={() => setCurrentStep(1)}
                errors={step2Errors}
              />
            )}

            {/* Step 3: Photos & Site Details */}
            {currentStep === 3 && (
              <Step3SitePhotos
                data={step3Data}
                onChange={(updates) => setStep3Data((prev) => ({ ...prev, ...updates }))}
                onNext={handleStep3Next}
                onBack={() => setCurrentStep(2)}
                errors={step3Errors}
              />
            )}

            {/* Step 4: Contact, Consent & Submission */}
            {currentStep === 4 && (
              <Step4ContactConsent
                data={step4Data}
                step1Data={step1Data}
                step2Data={step2Data}
                step3Data={step3Data}
                onChange={(updates) => setStep4Data((prev) => ({ ...prev, ...updates }))}
                onEditStep={(step) => setCurrentStep(step)}
                onSubmit={handleSubmit}
                onBack={() => setCurrentStep(3)}
                isSubmitting={isSubmitting}
                submitError={submitError}
                errors={step4Errors}
              />
            )}
          </div>
        )}

        {/* Trust Badges */}
        {!submissionResponse && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#5C4D41]">
            <div className="p-4 rounded-2xl bg-white/70 border border-[#E5DDD1] flex items-start gap-3">
              <Shield className="w-5 h-5 text-[#2D6A4F] shrink-0" />
              <div>
                <strong className="font-bold text-[#201A15] block">Seasoned Solid Timber</strong>
                <span>100% seasoned Burma & CP Teakwood with zero green sapwood defects.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-[#E5DDD1] flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#8B5A2B] shrink-0" />
              <div>
                <strong className="font-bold text-[#201A15] block">Laser Site Measurement</strong>
                <span>Carpenters conduct on-site verification across Krishna & NTR districts.</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 border border-[#E5DDD1] flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#8B5A2B] shrink-0" />
              <div>
                <strong className="font-bold text-[#201A15] block">24-Hour Review Turnaround</strong>
                <span>Our lead craftsman responds with guidance and scheduled site visit slots.</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Floating Contact Action */}
      <MobileContactAction contact={settings.contact} />

      {/* Site Footer */}
      <SiteFooter settings={settings} />
    </div>
  );
}
