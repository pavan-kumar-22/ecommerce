import { NextRequest, NextResponse } from 'next/server';
import { createPaymentSession } from '@/lib/public-data';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const result = createPaymentSession(body);

    if (!result.success || !result.session) {
      return NextResponse.json(
        {
          error: {
            code: 'PAYMENT_SESSION_ERROR',
            message: result.error || 'Failed to initiate payment session.',
          },
        },
        { status: result.statusCode || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.session,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'Payment initiation error.',
        },
      },
      { status: 500 }
    );
  }
}
