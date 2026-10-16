import { NextResponse } from 'next/server';
import { verifiedSiteSettings } from '@/lib/public-data';

export async function GET() {
  try {
    // Return verified public business configuration
    return NextResponse.json({
      success: true,
      data: verifiedSiteSettings,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve site settings',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
