export type SubmissionStatus = 'pending' | 'generated' | 'published';

export interface SubmissionImage {
  id: string;
  submissionId: string;
  originalFilename: string;
  storagePath: string; // e.g. "/uploads/img_xxx.webp"
  width: number;
  height: number;
  aspectRatio: number; // width / height
  sizeBytes: number;
  createdAt: string;
}

export type TapeStyle = 'kraft' | 'pink-washi' | 'gold-foil' | 'mint-washi' | 'lavender-washi' | 'none';
export type TapePosition = 'top-center' | 'top-left' | 'top-right' | 'double-corner' | 'cross' | 'corner-left' | 'corner-right';
export type PinStyle = 'gold-pin' | 'silver-pin' | 'rose-gold-clip' | 'stamp' | 'none';

export interface PlacedPhotoConfig {
  imageId: string;
  imageUrl: string;
  caption?: string;
  rotationDeg: number; // e.g., -6 to +6
  zone: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'left-flank' | 'right-flank' | 'top-banner' | 'bottom-row' | 'orbit';
  // Desktop layout absolute coordinates (% of container or calculated positions)
  desktopPos: {
    topPct?: number;
    bottomPct?: number;
    leftPct?: number;
    rightPct?: number;
    widthPx: number;
    zIndex: number;
  };
  mobileOrder: number;
  mobileRotationDeg: number;
  tapeStyle: TapeStyle;
  tapePosition: TapePosition;
  pinStyle: PinStyle;
  stickerEmoji?: string;
}

export interface LetterCardConfig {
  rotationDeg: number;
  paperStyle: 'antique-parchment' | 'cream-cardstock' | 'pastel-rose' | 'kraft-pressed' | 'midnight-velvet';
  waxSeal: {
    show: boolean;
    emoji: string;
    label: string;
  };
  postageStamp: {
    show: boolean;
    location: 'top-right' | 'top-left';
    label: string;
    date: string;
  };
}

export interface DecorationItem {
  id: string;
  type: 'sticker' | 'stamp' | 'washi-strip' | 'doodle' | 'heart' | 'star' | 'cake' | 'flower';
  content: string; // Emoji, SVG path, or label
  desktopPos: {
    topPct?: number;
    bottomPct?: number;
    leftPct?: number;
    rightPct?: number;
    zIndex: number;
  };
  rotationDeg: number;
  scale: number;
  opacity: number;
}

export interface LetterThemeConfig {
  id: string;
  name: string;
  description: string;
  bgGradient: string;
  bgPattern: 'dots' | 'grain' | 'grid' | 'stars' | 'subtle-lines' | 'clean';
  ambientParticles: 'confetti' | 'sparkles' | 'hearts' | 'stars' | 'none';
  cardPaperStyle: 'antique-parchment' | 'cream-cardstock' | 'pastel-rose' | 'kraft-pressed' | 'midnight-velvet';
  accentColor: string;
  fontClassHeading: string;
  fontClassBody: string;
  tapeStyleDefault: TapeStyle;
  stampLabels: string[];
  stickers: string[];
}

export interface LetterLayoutConfig {
  seed: number;
  themeId: string;
  theme: LetterThemeConfig;
  photos: PlacedPhotoConfig[];
  letterCard: LetterCardConfig;
  decorations: DecorationItem[];
  generatedAt: string;
}

export interface GeneratedLetter {
  id: string;
  submissionId: string;
  themeId: string;
  layoutConfig: LetterLayoutConfig;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Submission {
  id: string;
  contributorName: string;
  letterContent: string;
  wordCount: number;
  status: SubmissionStatus;
  images: SubmissionImage[];
  generatedLetter?: GeneratedLetter | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
}

// Public API Types
export interface PublicLetterSummary {
  id: string;
  contributorName: string;
  letterUrl: string;
  coverImage: string | null;
  photoCount: number;
  wordCount: number;
  excerpt: string;
  publishedAt: string;
}

export interface PublicLetterDetail {
  id: string;
  contributorName: string;
  letterContent: string;
  wordCount: number;
  publishedAt: string;
  images: {
    id: string;
    url: string;
    width: number;
    height: number;
  }[];
  layout: LetterLayoutConfig;
}
