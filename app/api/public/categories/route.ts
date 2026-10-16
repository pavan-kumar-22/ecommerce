import { NextRequest, NextResponse } from 'next/server';
import { verifiedCategories } from '@/lib/public-data';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('active') !== 'false';

    // In this public endpoint, only active categories are served
    const categories = activeOnly ? verifiedCategories : verifiedCategories;

    return NextResponse.json({
      success: true,
      data: categories,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve categories',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
