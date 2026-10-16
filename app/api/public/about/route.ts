import { NextResponse } from 'next/server';
import { getPublicAboutContent } from '@/lib/public-data';

export async function GET() {
  try {
    const content = getPublicAboutContent();
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          code: 'SERVER_ERROR',
          message: 'Unable to retrieve about content',
        },
      },
      { status: 500 }
    );
  }
}
