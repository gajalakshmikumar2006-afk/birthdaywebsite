import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';
import {
  GeneratedLetter,
  LetterLayoutConfig,
  PublicLetterDetail,
  PublicLetterSummary,
  Submission,
  SubmissionImage,
  SubmissionStatus,
} from '@/types';
import { deleteStoredImage } from './image-processor';

// Determine the best writable data directory
function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    const tmpDir = path.join('/tmp', 'birthday_data');
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true });
      } catch {
        // Handled
      }
    }
    return tmpDir;
  }

  const localDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(localDir)) {
    try {
      fs.mkdirSync(localDir, { recursive: true });
    } catch {
      const fallbackDir = path.join('/tmp', 'birthday_data');
      fs.mkdirSync(fallbackDir, { recursive: true });
      return fallbackDir;
    }
  }
  return localDir;
}

function getDbFilePath(): string {
  return path.join(getDataDir(), 'birthday_database.json');
}

interface DatabaseSchema {
  submissions: Record<string, Omit<Submission, 'images' | 'generatedLetter'>>;
  images: Record<string, SubmissionImage>;
  generatedLetters: Record<string, GeneratedLetter>;
}

const DEFAULT_DB: DatabaseSchema = {
  submissions: {},
  images: {},
  generatedLetters: {},
};

// In-memory cache for fast serverless execution
let memoryDb: DatabaseSchema | null = null;

function readDb(): DatabaseSchema {
  if (memoryDb) return memoryDb;

  const dbFile = getDbFilePath();
  if (!fs.existsSync(dbFile)) {
    writeDb(DEFAULT_DB);
    return DEFAULT_DB;
  }
  try {
    const raw = fs.readFileSync(dbFile, 'utf-8');
    memoryDb = JSON.parse(raw);
    return memoryDb!;
  } catch {
    return DEFAULT_DB;
  }
}

function writeDb(data: DatabaseSchema): void {
  memoryDb = data;
  const dbFile = getDbFilePath();
  try {
    const tmpFile = `${dbFile}.${Date.now()}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, dbFile);
  } catch (err) {
    console.warn('Could not write database to disk:', err);
  }
}

// Helper: Count words in a string
export function countWords(text: string): number {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Helper: Get image by filename
export function getImageByFilename(filename: string): SubmissionImage | null {
  const db = readDb();
  const found = Object.values(db.images).find((img) =>
    img.storagePath.endsWith(filename)
  );
  return found || null;
}

// 1. Get all submissions (for Admin)
export function getAllSubmissions(): Submission[] {
  const db = readDb();
  const subList = Object.values(db.submissions);

  const enriched = subList.map((sub) => {
    const images = Object.values(db.images).filter((img) => img.submissionId === sub.id);
    const generatedLetter = Object.values(db.generatedLetters).find(
      (letRec) => letRec.submissionId === sub.id
    );
    return {
      ...sub,
      images,
      generatedLetter: generatedLetter || null,
    };
  });

  // Sort descending by createdAt
  return enriched.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// 2. Get single submission by ID
export function getSubmissionById(id: string): Submission | null {
  const db = readDb();
  const sub = db.submissions[id];
  if (!sub) return null;

  const images = Object.values(db.images).filter((img) => img.submissionId === sub.id);
  const generatedLetter = Object.values(db.generatedLetters).find(
    (letRec) => letRec.submissionId === sub.id
  );

  return {
    ...sub,
    images,
    generatedLetter: generatedLetter || null,
  };
}

// 3. Create a new submission
export function createSubmission(
  contributorName: string,
  letterContent: string,
  processedImages: Omit<SubmissionImage, 'id' | 'submissionId' | 'createdAt'>[]
): Submission {
  const db = readDb();
  const subId = `sub_${nanoid(10)}`;
  const now = new Date().toISOString();
  const wordCount = countWords(letterContent);

  const newSub = {
    id: subId,
    contributorName: contributorName.trim(),
    letterContent: letterContent.trim(),
    wordCount,
    status: 'pending' as SubmissionStatus,
    createdAt: now,
    updatedAt: now,
  };

  db.submissions[subId] = newSub;

  const insertedImages: SubmissionImage[] = [];
  for (const img of processedImages) {
    const imageId = `img_${nanoid(10)}`;
    const newImage: SubmissionImage = {
      ...img,
      id: imageId,
      submissionId: subId,
      createdAt: now,
    };
    db.images[imageId] = newImage;
    insertedImages.push(newImage);
  }

  writeDb(db);

  return {
    ...newSub,
    images: insertedImages,
    generatedLetter: null,
  };
}

// 4. Save / Update Generated Letter
export function saveGeneratedLetter(
  submissionId: string,
  themeId: string,
  layoutConfig: LetterLayoutConfig,
  publish: boolean = false
): GeneratedLetter {
  const db = readDb();
  const submission = db.submissions[submissionId];
  if (!submission) {
    throw new Error(`Submission ${submissionId} not found`);
  }

  const now = new Date().toISOString();
  let letter = Object.values(db.generatedLetters).find(
    (l) => l.submissionId === submissionId
  );

  if (letter) {
    // Update existing letter
    letter.themeId = themeId;
    letter.layoutConfig = layoutConfig;
    letter.updatedAt = now;
    if (publish) {
      letter.published = true;
      letter.publishedAt = now;
    }
    db.generatedLetters[letter.id] = letter;
  } else {
    // Create new letter
    const letterId = `let_${nanoid(12)}`;
    letter = {
      id: letterId,
      submissionId,
      themeId,
      layoutConfig,
      published: publish,
      publishedAt: publish ? now : null,
      createdAt: now,
      updatedAt: now,
    };
    db.generatedLetters[letterId] = letter;
  }

  // Update submission status
  submission.status = letter.published ? 'published' : 'generated';
  submission.updatedAt = now;
  if (letter.published) {
    submission.publishedAt = now;
  }
  db.submissions[submissionId] = submission;

  writeDb(db);
  return letter;
}

// 5. Toggle Publish Status
export function setLetterPublishStatus(
  letterId: string,
  published: boolean
): { letter: GeneratedLetter; submission: Submission } | null {
  const db = readDb();
  const letter = db.generatedLetters[letterId];
  if (!letter) return null;

  const submission = db.submissions[letter.submissionId];
  if (!submission) return null;

  const now = new Date().toISOString();
  letter.published = published;
  letter.publishedAt = published ? (letter.publishedAt || now) : null;
  letter.updatedAt = now;
  db.generatedLetters[letterId] = letter;

  submission.status = published ? 'published' : 'generated';
  submission.publishedAt = letter.publishedAt;
  submission.updatedAt = now;
  db.submissions[submission.id] = submission;

  writeDb(db);

  const enrichedSub = getSubmissionById(submission.id)!;
  return { letter, submission: enrichedSub };
}

// 6. Get Generated Letter by ID
export function getGeneratedLetterById(id: string): GeneratedLetter | null {
  const db = readDb();
  return db.generatedLetters[id] || null;
}

// 7. Get Generated Letter by Submission ID
export function getGeneratedLetterBySubmissionId(subId: string): GeneratedLetter | null {
  const db = readDb();
  return Object.values(db.generatedLetters).find((l) => l.submissionId === subId) || null;
}

// 8. Delete Submission and all related files
export function deleteSubmission(id: string): boolean {
  const db = readDb();
  const sub = db.submissions[id];
  if (!sub) return false;

  // Find and delete images
  const relatedImages = Object.values(db.images).filter((img) => img.submissionId === id);
  for (const img of relatedImages) {
    deleteStoredImage(img.storagePath);
    delete db.images[img.id];
  }

  // Find and delete generated letter
  const relatedLetter = Object.values(db.generatedLetters).find((l) => l.submissionId === id);
  if (relatedLetter) {
    delete db.generatedLetters[relatedLetter.id];
  }

  // Delete submission
  delete db.submissions[id];

  writeDb(db);
  return true;
}

// 9. Public API: Get all published letters summary
export function getPublicPublishedLetters(baseUrl: string = ''): PublicLetterSummary[] {
  const db = readDb();
  const publishedLetters = Object.values(db.generatedLetters).filter((l) => l.published);

  return publishedLetters
    .map((letter) => {
      const submission = db.submissions[letter.submissionId];
      if (!submission) return null;

      const images = Object.values(db.images).filter(
        (img) => img.submissionId === submission.id
      );
      const coverImage = images.length > 0 ? `${baseUrl}${images[0].storagePath}` : null;
      const letterUrl = `${baseUrl}/letters/${letter.id}`;

      // Create a clean 100-char excerpt
      const excerpt =
        submission.letterContent.length > 110
          ? `${submission.letterContent.slice(0, 107).trim()}...`
          : submission.letterContent;

      return {
        id: letter.id,
        contributorName: submission.contributorName,
        letterUrl,
        coverImage,
        photoCount: images.length,
        wordCount: submission.wordCount,
        excerpt,
        publishedAt: letter.publishedAt || letter.createdAt,
      };
    })
    .filter(Boolean) as PublicLetterSummary[];
}

// 10. Public API: Get single published letter detail
export function getPublicLetterDetail(id: string, baseUrl: string = ''): PublicLetterDetail | null {
  const db = readDb();
  const letter = db.generatedLetters[id];
  if (!letter || !letter.published) return null;

  const submission = db.submissions[letter.submissionId];
  if (!submission) return null;

  const images = Object.values(db.images)
    .filter((img) => img.submissionId === submission.id)
    .map((img) => ({
      id: img.id,
      url: `${baseUrl}${img.storagePath}`,
      width: img.width,
      height: img.height,
    }));

  return {
    id: letter.id,
    contributorName: submission.contributorName,
    letterContent: submission.letterContent,
    wordCount: submission.wordCount,
    publishedAt: letter.publishedAt || letter.createdAt,
    images,
    layout: letter.layoutConfig,
  };
}
