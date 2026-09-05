import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { nanoid } from 'nanoid';

// Determine the best writable directory for uploaded images
export function getUploadDir(): string {
  // On Vercel / AWS Lambda / Serverless, /var/task is strictly read-only, so use /tmp
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    const tmpDir = path.join('/tmp', 'birthday_uploads');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {
        // Handled
      }
    }
    return tmpDir;
  }

  // Local development
  const localDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(localDir)) {
    try {
      fs.mkdirSync(localDir, { recursive: true });
    } catch {
      // If local mkdir fails, fallback to /tmp or os tmp
      const fallbackDir = path.join('/tmp', 'birthday_uploads');
      fs.mkdirSync(fallbackDir, { recursive: true });
      return fallbackDir;
    }
  }
  return localDir;
}

export interface ProcessedImageResult {
  id: string;
  originalFilename: string;
  storagePath: string; // URL path: /uploads/xxx.webp
  filePath: string; // Absolute disk path
  dataUrl?: string; // Base64 fallback for serverless persistence
  width: number;
  height: number;
  aspectRatio: number;
  sizeBytes: number;
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string
): Promise<ProcessedImageResult> {
  const uploadDir = getUploadDir();

  const id = `img_${nanoid(12)}`;
  const filename = `${id}.webp`;
  const targetFilePath = path.join(uploadDir, filename);

  // Process image with Sharp:
  // - Auto-rotate based on EXIF
  // - Max dimension 1600px (preserving aspect ratio)
  // - Convert to WebP format with quality 80
  const pipeline = sharp(buffer)
    .rotate() // Handles mobile camera EXIF orientation
    .resize({
      width: 1600,
      height: 1600,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 80, effort: 4 });

  const webpBuffer = await pipeline.toBuffer();
  const metadata = await sharp(webpBuffer).metadata();

  // Try writing to disk
  try {
    fs.writeFileSync(targetFilePath, webpBuffer);
  } catch (err) {
    console.warn('Could not write image to disk, relying on dataUrl:', err);
  }

  const width = metadata.width || 800;
  const height = metadata.height || 600;
  const aspectRatio = Number((width / height).toFixed(3));
  const dataUrl = `data:image/webp;base64,${webpBuffer.toString('base64')}`;

  return {
    id,
    originalFilename,
    storagePath: `/uploads/${filename}`,
    filePath: targetFilePath,
    dataUrl,
    width,
    height,
    aspectRatio,
    sizeBytes: webpBuffer.length,
  };
}

export function deleteStoredImage(storagePath: string): boolean {
  try {
    const filename = path.basename(storagePath);
    const fullPath = path.join(getUploadDir(), filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
  } catch {
    // Ignore deletion error
  }
  return false;
}
