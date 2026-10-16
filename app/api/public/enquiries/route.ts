import { NextRequest, NextResponse } from 'next/server';
import { submitGeneralEnquiry } from '@/lib/public-data';
import { GeneralEnquiryPayload } from '@/types/api';

// In-memory deduplication cache for double-clicks (TTL: 30s)
const submissionDedupeMap = new Map<string, { timestamp: number; response: any }>();

function cleanupDedupeMap() {
  const now = Date.now();
  for (const [key, val] of submissionDedupeMap.entries()) {
    if (now - val.timestamp > 30000) {
      submissionDedupeMap.delete(key);
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    cleanupDedupeMap();
    const body: GeneralEnquiryPayload = await request.json();

    // Check duplicate submission key: phone + serviceId + description snippet
    const phone = body.customer?.phone?.replace(/\D/g, '') || '';
    const desc = body.description?.trim() || '';
    const dedupeKey = `${phone}_${body.serviceId}_${desc.slice(0, 30)}`;

    if (phone && dedupeKey && submissionDedupeMap.has(dedupeKey)) {
      const existing = submissionDedupeMap.get(dedupeKey)!;
      if (Date.now() - existing.timestamp < 30000) {
        return NextResponse.json(existing.response, { status: 200 });
      }
    }

    const result = submitGeneralEnquiry(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: result.error || 'Invalid enquiry parameters.',
          },
        },
        { status: 400 }
      );
    }

    if (dedupeKey && result.data) {
      submissionDedupeMap.set(dedupeKey, {
        timestamp: Date.now(),
        response: result.data,
      });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'An unexpected error occurred while processing your request. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
