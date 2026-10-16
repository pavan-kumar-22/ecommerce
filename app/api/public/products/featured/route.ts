import { NextRequest, NextResponse } from 'next/server';
import { verifiedFeaturedProducts } from '@/lib/public-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6', 10);

    const sliced = verifiedFeaturedProducts.slice(0, limit);

    return NextResponse.json({
      items: sliced,
      total: sliced.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to retrieve featured products',
        items: [],
      },
      { status: 500 }
    );
  }
}
