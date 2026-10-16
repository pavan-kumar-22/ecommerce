import { NextResponse } from 'next/server';
import { getPublicFilterOptions } from '@/lib/public-data';

export async function GET() {
  try {
    const filters = getPublicFilterOptions();
    return NextResponse.json({
      success: true,
      data: filters,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve filter options',
      },
      { status: 500 }
    );
  }
}
