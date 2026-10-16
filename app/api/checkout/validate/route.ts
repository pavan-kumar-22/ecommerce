import { NextRequest, NextResponse } from 'next/server';
import { validateCheckoutCart } from '@/lib/public-data';

export async function POST(req: NextRequest) {
  try {
    const sessionIdHeader = req.headers.get('x-cart-session-id') || 'demo_guest_session';
    const body = await req.json().catch(() => ({}));
    const guestSessionId = body.guestSessionId || sessionIdHeader;

    const validation = validateCheckoutCart(
      guestSessionId,
      body.fulfilmentMethod || 'local_delivery',
      body.couponCode
    );

    return NextResponse.json({
      success: true,
      data: validation,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: {
          code: 'CHECKOUT_VALIDATION_ERROR',
          message: error.message || 'Failed to revalidate checkout items.',
        },
      },
      { status: 400 }
    );
  }
}
