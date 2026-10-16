import { NextRequest, NextResponse } from 'next/server';
import { applyCartCoupon, removeCartCoupon } from '@/lib/public-data';

function getSessionId(req: NextRequest): string {
  const headerSession = req.headers.get('x-cart-session-id');
  if (headerSession && headerSession.trim()) {
    return headerSession.trim();
  }
  const cookieSession = req.cookies.get('vc_cart_session_id')?.value;
  if (cookieSession && cookieSession.trim()) {
    return cookieSession.trim();
  }
  return 'demo_guest_session';
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const body = await request.json();
    const code = body.code;

    const result = applyCartCoupon(sessionId, code);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_COUPON',
            message: result.error || 'Invalid or expired promotional code.',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(result.cart, { status: 200 });
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Unable to apply coupon.' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const result = removeCartCoupon(sessionId);
    return NextResponse.json(result.cart, { status: 200 });
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'Unable to remove coupon.' } },
      { status: 500 }
    );
  }
}
