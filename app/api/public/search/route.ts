import { NextRequest, NextResponse } from 'next/server';
import { queryUnifiedSearch } from '@/lib/public-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const q = searchParams.get('q') || '';
    const type = (searchParams.get('type') as any) || 'all';
    const pageRaw = searchParams.get('page');
    const limitRaw = searchParams.get('limit');

    const page = pageRaw ? parseInt(pageRaw, 10) : 1;
    const limit = limitRaw ? parseInt(limitRaw, 10) : 12;

    const result = queryUnifiedSearch({
      q,
      type,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    console.error('Search API error:', error);
    return NextResponse.json(
      {
        error: 'Search operation failed',
        items: [],
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        counts: { all: 0, products: 0, services: 0 },
        matchedCategories: [],
        suggestions: [],
      },
      { status: 500 }
    );
  }
}
