import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { nanoid } from 'nanoid';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure upload directory exists
function ensureUploadDir() {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export interface ProcessedImageResult {
  id: string;
  originalFilename: string;
  storagePath: string; // URL path: /uploads/xxx.webp
  filePath: string; // Absolute disk path
  width: number;
  height: number;
  aspectRatio: number;
  sizeBytes: number;
}

export async function processAndSaveImage(
  buffer: Buffer,
  originalFilename: string
): Promise<ProcessedImageResult> {
  ensureUploadDir();

  const id = `img_${nanoid(12)}`;
  const filename = `${id}.webp`;
  const targetFilePath = path.join(UPLOAD_DIR, filename);

  // Process image with Sharp:
  // - Auto-rotate based on EXIF
  // - Max dimension 1920px (preserving aspect ratio)
  // - Convert to WebP format with quality 85
  const pipeline = sharp(buffer)
    .rotate() // Handles mobile camera EXIF orientation
    .resize({
      width: 1920,
      height: 1920,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 4 });

  const metadata = await pipeline.metadata();
  await pipeline.toFile(targetFilePath);

  // Get final written file stats
  const stats = fs.statSync(targetFilePath);
  const width = metadata.width || 800;
  const height = metadata.height || 600;
  const aspectRatio = Number((width / height).toFixed(3));

  return {
    id,
    originalFilename,
    storagePath: `/uploads/${filename}`,
    filePath: targetFilePath,
    width,
    height,
    aspectRatio,
    sizeBytes: stats.size,
  };
}

export function deleteStoredImage(storagePath: string): boolean {
  try {
    const filename = path.basename(storagePath);
    const fullPath = path.join(UPLOAD_DIR, filename);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
  } catch {
    // Ignore deletion error
  }
  return false;
}
