import { NextRequest, NextResponse } from 'next/server';
import { getPublicProductBySlug } from '@/lib/public-data';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await props.params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Product slug is required' },
        { status: 400 }
      );
    }

    const product = getPublicProductBySlug(slug);

    if (!product) {
      return NextResponse.json(
        {
          error: 'Product not found or is no longer available to the public',
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Failed to get product details:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
