import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getUploadDir } from '@/lib/image-processor';
import { getImageByFilename } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    const sanitizedFilename = path.basename(filename);
    const uploadDir = getUploadDir();
    const diskPath = path.join(uploadDir, sanitizedFilename);

    // 1. If file exists on disk, serve directly
    if (fs.existsSync(diskPath)) {
      const buffer = fs.readFileSync(diskPath);
      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 2. Fallback: Lookup in database for base64 dataUrl (serverless cold-start resiliency)
    const imageRecord = getImageByFilename(sanitizedFilename);
    if (imageRecord && imageRecord.dataUrl) {
      const base64Data = imageRecord.dataUrl.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');

      // Cache to disk for future requests
      try {
        fs.writeFileSync(diskPath, buffer);
      } catch {
        // Ignore cache write error
      }

      return new NextResponse(buffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/webp',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (err) {
    console.error('Error serving image:', err);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
