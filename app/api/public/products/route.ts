import { NextRequest, NextResponse } from 'next/server';
import { queryPublicProducts } from '@/lib/public-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const category = searchParams.get('category') || undefined;
    const priceMode = searchParams.get('priceMode') || undefined;
    const search = searchParams.get('search') || searchParams.get('q') || undefined;
    const sort = searchParams.get('sort') || 'recommended';

    const priceMinRaw = searchParams.get('priceMin');
    const priceMaxRaw = searchParams.get('priceMax');
    const priceMin = priceMinRaw ? parseFloat(priceMinRaw) : undefined;
    const priceMax = priceMaxRaw ? parseFloat(priceMaxRaw) : undefined;

    // Validate price range: reject minimum greater than maximum
    if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) {
      return NextResponse.json(
        {
          error: 'Invalid price range: priceMin cannot be greater than priceMax',
          items: [],
          total: 0,
        },
        { status: 400 }
      );
    }

    const pageRaw = searchParams.get('page');
    const limitRaw = searchParams.get('limit');
    const page = pageRaw ? parseInt(pageRaw, 10) : 1;
    const limit = limitRaw ? parseInt(limitRaw, 10) : 12;

    const result = queryPublicProducts({
      category,
      priceMode,
      priceMin,
      priceMax,
      search,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Failed to list public products:', error);
    return NextResponse.json(
      {
        error: 'Failed to retrieve products',
        items: [],
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
      },
      { status: 500 }
    );
  }
}
