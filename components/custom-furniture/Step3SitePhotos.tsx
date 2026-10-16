'use client';

import React, { useState } from 'react';
import {
  UploadCloud,
  X,
  MapPin,
  Calendar,
  Clock,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  FileImage,
  RefreshCw,
} from 'lucide-react';
import { SiteVisitRequested, PreferredTimeWindow, ReferencePhotoMeta } from '@/types/api';

export interface Step3FormData {
  area: string;
  visitRequested: SiteVisitRequested;
  preferredDate?: string | null;
  preferredTimeWindow?: PreferredTimeWindow | null;
  accessNotes?: string;
  referencePhotos?: ReferencePhotoMeta[];
}

interface Step3Props {
  data: Step3FormData;
  onChange: (updates: Partial<Step3FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  errors: Record<string, string>;
}

export const Step3SitePhotos: React.FC<Step3Props> = ({
  data,
  onChange,
  onNext,
  onBack,
  errors,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Today's ISO date string (YYYY-MM-DD) for min date attribute
  const todayStr = new Date().toISOString().split('T')[0];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      const currentCount = (data.referencePhotos || []).length;
      const allowedCount = Math.max(0, 5 - currentCount);

      if (allowedCount === 0) {
        setUploadError('Maximum 5 reference photos allowed. Please remove existing ones to upload more.');
        setUploading(false);
        return;
      }

      Array.from(files).slice(0, allowedCount).forEach((file) => {
        formData.append('files', file);
      });

      const res = await fetch('/api/public/enquiries/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to upload image. Please try again.');
      }

      const newPhotos: ReferencePhotoMeta[] = json.data.map((item: any) => ({
        id: item.id,
        filename: item.filename,
        url: item.url,
        sizeBytes: item.sizeBytes,
      }));

      onChange({
        referencePhotos: [...(data.referencePhotos || []), ...newPhotos],
      });
    } catch (err: any) {
      setUploadError(err.message || 'File upload failed. You can proceed without photos or retry.');
    } finally {
      setUploading(false);
      // Reset input value
      e.target.value = '';
    }
  };

  const removePhoto = (id: string) => {
    const updated = (data.referencePhotos || []).filter((p) => p.id !== id);
    onChange({ referencePhotos: updated });
  };

  const showSiteVisitDetails =
    data.visitRequested === 'yes' || data.visitRequested === 'advise_me';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#8B5A2B] uppercase tracking-wider mb-1">
          <span>Step 3 of 4</span>
          <span>·</span>
          <span>Photos & Site Details</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#201A15]">
          Reference Photos and Site Survey Details
        </h2>
        <p className="text-sm text-[#5C4D41] mt-1 max-w-2xl">
          Upload reference photos or room sketches, and tell us your locality so we can arrange an on-site laser survey if required.
        </p>
      </div>

      {/* 1. Secure Photo Upload */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-[#201A15]">
            Reference Images / Room Sketches <span className="text-xs font-normal text-[#8C7E72]">(Optional · Max 5 photos · up to 5MB each)</span>
          </label>
          <span className="text-xs text-[#2D6A4F] font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Private & Confidential
          </span>
        </div>

        {/* Dropzone container */}
        <div className="border-2 border-dashed border-[#E5DDD1] rounded-2xl p-6 bg-white hover:bg-[#FAF7F2]/50 transition-colors text-center relative">
          <input
            id="photoUploadInput"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            disabled={uploading || (data.referencePhotos || []).length >= 5}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className="w-12 h-12 rounded-full bg-[#F3ECE2] text-[#8B5A2B] flex items-center justify-center">
              {uploading ? (
                <RefreshCw className="w-6 h-6 animate-spin text-[#8B5A2B]" />
              ) : (
                <UploadCloud className="w-6 h-6" />
              )}
            </div>

            <div className="text-sm font-bold text-[#201A15]">
              {uploading ? 'Validating and uploading images...' : 'Click to select or drag and drop photos'}
            </div>
            <p className="text-xs text-[#8C7E72]">
              Supports JPG, PNG, and WebP (up to 5 MB per file)
            </p>
          </div>
        </div>

        {/* Upload error banner with retry */}
        {uploadError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{uploadError}</span>
            </div>
            <button
              type="button"
              onClick={() => setUploadError(null)}
              className="text-xs font-bold text-red-800 underline hover:no-underline ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Uploaded thumbnails list */}
        {data.referencePhotos && data.referencePhotos.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-[#5C4D41]">
              Attached Photos ({data.referencePhotos.length}/5):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {data.referencePhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="relative group rounded-xl border border-[#E5DDD1] bg-[#FAF7F2] p-2.5 flex flex-col items-center text-center shadow-xs"
                >
                  <FileImage className="w-8 h-8 text-[#8B5A2B] my-2" />
                  <span className="text-[11px] font-semibold text-[#201A15] truncate w-full">
                    {photo.filename}
                  </span>
                  <span className="text-[10px] text-[#8C7E72]">
                    {(photo.sizeBytes / 1024).toFixed(0)} KB
                  </span>
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-xs transition-transform hover:scale-110 cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-[11px] text-[#8C7E72] leading-relaxed">
          Customer reference photos are stored securely for carpentry planning and quotation analysis. They will never be published to the public portfolio.
        </p>
      </div>

      {/* 2. Site Area / Locality */}
      <div className="space-y-2">
        <label htmlFor="siteArea" className="block text-sm font-bold text-[#201A15]">
          Locality / Area in Andhra Pradesh <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="siteArea"
            type="text"
            value={data.area}
            onChange={(e) => onChange({ area: e.target.value })}
            placeholder="e.g. Vuyyuru Town (Sai Baba Temple Area), Benz Circle Vijayawada, Kanna Thota Guntur"
            maxLength={100}
            className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
          />
          <MapPin className="w-4 h-4 text-[#8C7E72] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        {errors.area && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {errors.area}
          </p>
        )}
        <p className="text-xs text-[#8C7E72]">
          Note: We only request your neighborhood / locality at this stage. Your full residential street address is collected later only if a home survey or delivery is scheduled.
        </p>
      </div>

      {/* 3. Site Visit Requested */}
      <div className="space-y-2">
        <label className="block text-sm font-bold text-[#201A15]">
          Site Visit / Laser Measurement Requested? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'yes',
              title: 'Yes — Request Site Visit',
              desc: 'Carpenter will visit with laser tape and sample chips',
            },
            {
              id: 'no',
              title: 'No — Workshop Consultation',
              desc: 'I have measurements; phone/WhatsApp discussion is fine',
            },
            {
              id: 'advise_me',
              title: 'Advise Me',
              desc: 'Recommend if site visit is necessary for this work',
            },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => onChange({ visitRequested: option.id as SiteVisitRequested })}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                data.visitRequested === option.id
                  ? 'border-[#2D6A4F] bg-[#E8F2EC]/40 ring-2 ring-[#2D6A4F]/20'
                  : 'border-[#E5DDD1] bg-white hover:bg-[#FAF7F2]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  name="visitRequested"
                  checked={data.visitRequested === option.id}
                  onChange={() => onChange({ visitRequested: option.id as SiteVisitRequested })}
                  className="accent-[#2D6A4F]"
                />
                <span className="text-sm font-bold text-[#201A15]">{option.title}</span>
              </div>
              <p className="text-xs text-[#5C4D41] pl-5">{option.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Conditional Visit Preferences (Shown if 'yes' or 'advise_me') */}
      {showSiteVisitDetails && (
        <div className="p-5 rounded-2xl bg-[#F9F5EF] border border-[#E5DDD1] space-y-5 animate-fadeIn">
          <div className="border-b border-[#E5DDD1] pb-3">
            <h4 className="text-sm font-bold text-[#3E2312] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#8B5A2B]" />
              <span>Preferred Site Visit Availability</span>
            </h4>
            <p className="text-xs text-[#5C4D41] mt-0.5">
              Specifying your availability helps us match artisan rounds. A preference does not imply immediate availability until confirmed by phone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Date Picker */}
            <div className="space-y-1.5">
              <label htmlFor="preferredDate" className="block text-xs font-bold text-[#5C4D41]">
                Preferred Date (Must be today or future date)
              </label>
              <input
                id="preferredDate"
                type="date"
                min={todayStr}
                value={data.preferredDate || ''}
                onChange={(e) => onChange({ preferredDate: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
              />
              {errors.preferredDate && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.preferredDate}
                </p>
              )}
            </div>

            {/* Time Window */}
            <div className="space-y-1.5">
              <label htmlFor="preferredTime" className="block text-xs font-bold text-[#5C4D41]">
                Preferred Time Slot
              </label>
              <select
                id="preferredTime"
                value={data.preferredTimeWindow || 'morning'}
                onChange={(e) =>
                  onChange({ preferredTimeWindow: e.target.value as PreferredTimeWindow })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#E5DDD1] rounded-lg focus-accessible focus:border-[#8B5A2B]"
              >
                <option value="morning">Morning (9:00 AM – 12:00 PM)</option>
                <option value="afternoon">Afternoon (1:00 PM – 4:00 PM)</option>
                <option value="evening">Evening (4:00 PM – 7:00 PM)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. Access Notes */}
      <div className="space-y-2">
        <label htmlFor="accessNotes" className="block text-sm font-bold text-[#201A15]">
          Access Notes & Property Features <span className="text-xs font-normal text-[#8C7E72]">(Optional)</span>
        </label>
        <textarea
          id="accessNotes"
          rows={2}
          value={data.accessNotes || ''}
          onChange={(e) => onChange({ accessNotes: e.target.value })}
          placeholder="e.g. 2nd floor flat without elevator; wide stairs; vehicle parking available in front of house..."
          maxLength={300}
          className="w-full p-3 text-sm bg-white border border-[#E5DDD1] rounded-xl focus-accessible focus:border-[#8B5A2B]"
        />
        <p className="text-[11px] text-[#8C7E72]">
          Security notice: Do not include sensitive private details such as security codes or lock combinations.
        </p>
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
          <span>Continue to Contact & Submit</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
