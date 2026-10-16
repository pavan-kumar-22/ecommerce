import { NextRequest, NextResponse } from 'next/server';
import { getPublicServiceBySlug } from '@/lib/public-data';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;

    if (!slug) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Service identifier is required.',
          },
        },
        { status: 400 }
      );
    }

    const service = getPublicServiceBySlug(slug);

    if (!service) {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Carpentry service not found or is currently inactive.',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(service, { status: 200 });
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Failed to get service details:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to retrieve service details at this time.',
        },
      },
      { status: 500 }
    );
  }
}
