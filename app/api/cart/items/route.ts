import { NextRequest, NextResponse } from 'next/server';
import { addItemToCart } from '@/lib/public-data';
import { AddToCartPayload } from '@/types/api';

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
    const body: AddToCartPayload = await request.json();

    const result = addItemToCart(sessionId, body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'CART_ADD_ERROR',
            message: result.error || 'Failed to add item to cart.',
          },
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json(result.cart, { status: 201 });
    response.headers.set('x-cart-session-id', sessionId);
    return response;
  } catch (error) {
    if ((error as any)?.digest?.startsWith('NEXT_')) {
      throw error;
    }
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: 'An unexpected error occurred while adding to cart.' } },
      { status: 500 }
    );
  }
}
