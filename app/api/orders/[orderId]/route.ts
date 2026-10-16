import { NextRequest, NextResponse } from 'next/server';
import { getOrderById } from '@/lib/public-data';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const url = new URL(req.url);
    const token = url.searchParams.get('token') || undefined;
    const sessionIdHeader = req.headers.get('x-cart-session-id') || undefined;

    const result = getOrderById(orderId, token, sessionIdHeader);

    if (!result.success || !result.order) {
      return NextResponse.json(
        {
          error: {
            code: result.statusCode === 403 ? 'UNAUTHORIZED_ACCESS' : 'ORDER_NOT_FOUND',
            message: result.error || 'Order not found.',
          },
        },
        { status: result.statusCode || 404 }
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
          message: error.message || 'Failed to retrieve order.',
        },
      },
      { status: 500 }
    );
  }
}
