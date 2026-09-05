import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { setLetterPublishStatus } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { letterId, published } = body;

    if (!letterId || typeof published !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'letterId and boolean published are required' },
        { status: 400 }
      );
    }

    const result = setLetterPublishStatus(letterId, published);
    if (!result) {
      return NextResponse.json({ success: false, error: 'Letter not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      published: result.letter.published,
      publishedAt: result.letter.publishedAt,
      letter: result.letter,
      submission: result.submission,
      message: published ? 'Letter published successfully! 🎉' : 'Letter unpublished.',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update publish status';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
