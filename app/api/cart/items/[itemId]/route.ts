import { NextRequest, NextResponse } from 'next/server';
import { updateCartItem, removeCartItem } from '@/lib/public-data';

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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> | { itemId: string } }
) {
  try {
    const sessionId = getSessionId(request);
    const resolvedParams = await context.params;
    const itemId = resolvedParams.itemId;

    const body = await request.json();
    const quantity = body.quantity;

    const result = updateCartItem(sessionId, itemId, quantity);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'CART_UPDATE_ERROR',
            message: result.error || 'Failed to update item quantity.',
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
      { error: { code: 'SERVER_ERROR', message: 'Unable to update cart item.' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ itemId: string }> | { itemId: string } }
) {
  try {
    const sessionId = getSessionId(request);
    const resolvedParams = await context.params;
    const itemId = resolvedParams.itemId;

    const result = removeCartItem(sessionId, itemId);

    if (!result.success) {
      return NextResponse.json(
        {
          error: {
            code: 'CART_REMOVE_ERROR',
            message: result.error || 'Failed to remove item from cart.',
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
      { error: { code: 'SERVER_ERROR', message: 'Unable to remove cart item.' } },
      { status: 500 }
    );
  }
}
