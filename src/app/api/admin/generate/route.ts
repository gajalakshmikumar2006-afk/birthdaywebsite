import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { getSubmissionById, saveGeneratedLetter } from '@/lib/db';
import { generateLetterLayout } from '@/lib/generator/layout-engine';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const isAuth = await isAuthenticatedAdmin(request);
  if (!isAuth) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { submissionId, themeId, seed, publish } = body;

    if (!submissionId) {
      return NextResponse.json(
        { success: false, error: 'Submission ID is required' },
        { status: 400 }
      );
    }

    const submission = getSubmissionById(submissionId);
    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Automatically generate responsive photo collage & background layout
    const layoutConfig = generateLetterLayout(
      submission.images,
      themeId || 'vintage-scrapbook',
      seed
    );

    const savedLetter = saveGeneratedLetter(
      submissionId,
      layoutConfig.themeId,
      layoutConfig,
      publish ?? false
    );

    return NextResponse.json({
      success: true,
      letter: savedLetter,
      message: 'Letter generated successfully',
      previewUrl: `/admin/preview/${savedLetter.id}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Letter generation failed';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
