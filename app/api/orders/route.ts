import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/public-data';

export async function POST(req: NextRequest) {
  try {
    const sessionIdHeader = req.headers.get('x-cart-session-id') || 'demo_guest_session';
    const idempotencyHeader = req.headers.get('idempotency-key') || req.headers.get('x-idempotency-key');
    const body = await req.json().catch(() => ({}));

    const idempotencyKey = body.idempotencyKey || idempotencyHeader;
    const guestSessionId = body.guestSessionId || sessionIdHeader;

    const result = createOrder({
      ...body,
      idempotencyKey,
      guestSessionId,
    });

    if (!result.success || !result.order) {
      return NextResponse.json(
        {
          error: {
            code: 'ORDER_CREATION_FAILED',
            message: result.error || 'Failed to place order.',
          },
        },
        { status: result.statusCode || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.order,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: error.message || 'An unexpected error occurred while placing your order.',
        },
      },
      { status: 500 }
    );
  }
}
