import { NextRequest, NextResponse } from 'next/server';
import { getCart, clearCart } from '@/lib/public-data';

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

export async function GET(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const cart = getCart(sessionId);

    const response = NextResponse.json(cart, { status: 200 });
    response.headers.set('x-cart-session-id', sessionId);
    return response;
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    return NextResponse.json(
      { error: { code: 'CART_FETCH_ERROR', message: 'Failed to retrieve shopping cart.' } },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const sessionId = getSessionId(request);
    const result = clearCart(sessionId);
    return NextResponse.json(result.cart, { status: 200 });
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    return NextResponse.json(
      { error: { code: 'CART_CLEAR_ERROR', message: 'Failed to clear cart.' } },
      { status: 500 }
    );
  }
}
