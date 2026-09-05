import { NextRequest, NextResponse } from 'next/server';
import { countWords, createSubmission } from '@/lib/db';
import { processAndSaveImage } from '@/lib/image-processor';

export const dynamic = 'force-dynamic';

const MAX_WORDS = 150;
const MAX_IMAGES = 15;
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get('name')?.toString()?.trim() || '';
    const message = formData.get('message')?.toString()?.trim() || '';

    // 1. Validate Contributor Name
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Please enter your name.' },
        { status: 400 }
      );
    }
    if (name.length > 100) {
      return NextResponse.json(
        { success: false, error: 'Name cannot exceed 100 characters.' },
        { status: 400 }
      );
    }

    // 2. Validate Message & Word Count
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Please write a message.' },
        { status: 400 }
      );
    }

    const wordCount = countWords(message);
    if (wordCount > MAX_WORDS) {
      return NextResponse.json(
        {
          success: false,
          error: `Your message has ${wordCount} words. The maximum allowed is ${MAX_WORDS} words.`,
        },
        { status: 400 }
      );
    }

    // 3. Extract and validate images
    const imageFiles: File[] = [];
    const entries = formData.getAll('images');

    for (const entry of entries) {
      if (entry instanceof File && entry.size > 0) {
        imageFiles.push(entry);
      }
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Please upload at least 1 photo.' },
        { status: 400 }
      );
    }

    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json(
        {
          success: false,
          error: `You can upload a maximum of ${MAX_IMAGES} photos. You selected ${imageFiles.length}.`,
        },
        { status: 400 }
      );
    }

    for (const file of imageFiles) {
      if (!ALLOWED_MIME_TYPES.includes(file.type.toLowerCase())) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid file type (${file.name}). Supported formats: JPG, PNG, WEBP.`,
          },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name} is too large. Maximum size is 15MB per photo.`,
          },
          { status: 400 }
        );
      }
    }

    // 4. Process all images using Sharp
    const processedResults = [];
    for (const file of imageFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const processed = await processAndSaveImage(buffer, file.name);
      processedResults.push(processed);
    }

    // 5. Store in database
    createSubmission(name, message, processedResults);

    // 6. Return friendly minimal confirmation (no preview, no design leakage)
    return NextResponse.json({
      success: true,
      message: 'Your message has been received 💌',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit letter contribution.';
    console.error('Submission error:', err);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
