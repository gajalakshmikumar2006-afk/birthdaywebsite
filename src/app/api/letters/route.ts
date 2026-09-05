import { NextRequest, NextResponse } from 'next/server';
import { getPublicPublishedLetters } from '@/lib/db';

export const dynamic = 'force-dynamic';

function getBaseUrl(request: NextRequest): string {
  const customUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (customUrl) {
    return customUrl.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const host = request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  return `${proto}://${host}`;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function GET(request: NextRequest) {
  try {
    const baseUrl = getBaseUrl(request);
    const letters = getPublicPublishedLetters(baseUrl);

    return NextResponse.json(
      {
        success: true,
        count: letters.length,
        letters,
      },
      {
        status: 200,
        headers: CORS_HEADERS,
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch published letters';
    return NextResponse.json(
      { success: false, error: message },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
