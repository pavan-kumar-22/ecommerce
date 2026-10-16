import { NextRequest, NextResponse } from 'next/server';
import { createSiteVisitBooking } from '@/lib/public-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const result = createSiteVisitBooking(body);

    if (!result.success || !result.siteVisit) {
      return NextResponse.json(
        {
          error: {
            code: 'SITE_VISIT_SUBMISSION_FAILED',
            message: result.error || 'Failed to submit site visit request.',
          },
        },
        { status: result.statusCode || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.siteVisit,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'Error processing site visit request.',
        },
      },
      { status: 500 }
    );
  }
}
