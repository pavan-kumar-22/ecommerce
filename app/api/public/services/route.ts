import { NextRequest, NextResponse } from 'next/server';
import { queryPublicServices } from '@/lib/public-data';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const items = queryPublicServices({ category });

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
    console.error('Failed to list public services:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to retrieve carpentry services at this time.',
        },
      },
      { status: 500 }
    );
  }
}
