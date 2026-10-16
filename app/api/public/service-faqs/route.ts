import { NextRequest, NextResponse } from 'next/server';
import { getPublicServiceFaqs } from '@/lib/public-data';

export async function GET(_request: NextRequest) {
  try {
    const items = getPublicServiceFaqs();

    return NextResponse.json(
      {
        success: true,
        items,
        count: items.length,
      },
      { status: 200 }
    );
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Failed to get service FAQs:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to load service FAQs.',
        },
      },
      { status: 500 }
    );
  }
}
