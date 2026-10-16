import { NextRequest, NextResponse } from 'next/server';
import { submitProductEnquiry } from '@/lib/public-data';
import { ProductEnquiryPayload } from '@/types/api';

export async function POST(request: NextRequest) {
  try {
    const body: ProductEnquiryPayload = await request.json();

    const result = submitProductEnquiry(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error || 'Invalid product enquiry details',
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Failed to process product enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to process enquiry. Please try again or contact via WhatsApp.' },
      { status: 500 }
    );
  }
}
