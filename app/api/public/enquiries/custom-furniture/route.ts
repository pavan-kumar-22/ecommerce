import { NextRequest, NextResponse } from 'next/server';
import { submitCustomFurnitureEnquiry } from '@/lib/public-data';
import { CustomFurnitureEnquiryPayload } from '@/types/api';

// Simple in-memory deduplication cache for rapid double-clicks (TTL: 30s)
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
    const body: CustomFurnitureEnquiryPayload = await request.json();

    // Check duplicate submission key
    const phone = body.customer?.phone?.replace(/\D/g, '') || '';
    const desc = body.requirements?.description?.trim() || '';
    const dedupeKey = `${phone}_${body.requirements?.furnitureType}_${desc.slice(0, 30)}`;

    if (phone && dedupeKey && submissionDedupeMap.has(dedupeKey)) {
      const existing = submissionDedupeMap.get(dedupeKey)!;
      if (Date.now() - existing.timestamp < 30000) {
        return NextResponse.json(existing.response, { status: 200 });
      }
    }

    const result = submitCustomFurnitureEnquiry(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || 'Invalid custom furniture enquiry parameters.',
          statusCode: 400,
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
    console.error('Failed to process custom furniture enquiry:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
