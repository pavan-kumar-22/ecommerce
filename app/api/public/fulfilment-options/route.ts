import { NextResponse } from 'next/server';
import { getFulfilmentOptions } from '@/lib/public-data';

export async function GET() {
  const options = getFulfilmentOptions();
  return NextResponse.json({
    success: true,
    data: options,
    count: options.length,
    timestamp: new Date().toISOString(),
  });
}
